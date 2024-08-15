import "./App.css";
import { useState, FormEvent } from "react";

interface DataLists {
  id: Number;
  name: String;
  image: String;
  balance: Number;
}

type IsBoolean = Boolean;
type AllFriendList = DataLists[];

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

let OneObj = {
  id: 0,
  name: "",
  image: "",
  balance: 0,
};

function App() {
  const [showFriend, setShowFriend] = useState<IsBoolean>(false);
  const [showForm, setShowFrom] = useState<IsBoolean>(false);
  const [friends, setFriend] = useState<AllFriendList>(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState<DataLists>(OneObj); // selected friend

  function handleAddFriend(friend: DataLists) {
    return setFriend((friends) => [...friends, friend]);
  }

  function handleSelectedFriend(friend: DataLists): void {
    setSelectedFriend((curFriend: DataLists) => {
      return curFriend.id !== friend.id
        ? {
            id: +friend.id,
            name: `${friend.name}`,
            image: `${friend.image}`,
            balance: +friend.balance,
          }
        : curFriend.id !== 0
        ? {
            id: +friend.id,
            name: `${friend.name}`,
            image: `${friend.image}`,
            balance: +friend.balance,
          }
        : {
            id: 0,
            name: "",
            image: "",
            balance: 0,
          };
    });

    setShowFrom((isBool) => !isBool);
    if (selectedFriend.id === 0 && friend.id !== selectedFriend.id)
      setShowFrom(true);
    if (friend.id !== selectedFriend.id && showForm) setShowFrom(true);
  }

  function formAddFriend(showFriend: Boolean) {
    setShowFriend(() => !showFriend);
    setShowFrom(false);
  }

  function handleSpillBill(value: Number) {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              id: friend.id,
              name: friend.name,
              image: friend.image,
              balance: +friend.balance - +value,
            }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendLists
          friends={friends}
          onSelectedFriend={handleSelectedFriend}
        />

        {showFriend && <FormAddFriend handleAddFriend={handleAddFriend} />}

        <button className="button" onClick={() => formAddFriend(showFriend)}>
          {showFriend ? "Close" : "Add Friend"}
        </button>
      </div>

      {showForm ? (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSpillBill={handleSpillBill}
          key={Math.random()}
        />
      ) : null}
    </div>
  );
}

interface FormSpillElements extends HTMLFormControlsCollection {
  bill: HTMLInputElement;
  myExpense: HTMLInputElement;
  myFriendExpense: HTMLInputElement;
  whoIsPaying: HTMLInputElement;
}

interface FormSubmit extends HTMLFormElement {
  readonly elements: FormSpillElements;
}

interface FormSpill {
  selectedFriend: DataLists;
  handleSpillBill(bill: Number): void;
}

function FormSplitBill({ selectedFriend, handleSpillBill }: FormSpill) {
  let whoPay: String = "user";
  let isMyPaid: Number | String = "";
  let isFriendPaid: Number | String = "";
  let isBilllPaid: Number | String = "";
  const [whoIsPaying, setWhoIsPaying] = useState<String>(whoPay);

  const [isMyBillPaid, setIsMyBillPaid] = useState<Number | String>(isMyPaid); // My Expenses or me

  const [myFriendPaid, setMyFriendPaid] = useState<Number | String>(
    isFriendPaid
  ); // Your Expenses or me

  const [bill, setBill] = useState<Number | String>(isBilllPaid); // BIll

  function handleSubmit(e: FormEvent<FormSubmit>) {
    e.preventDefault();
    const target = e.currentTarget.elements;
    let whoIsPaying = target.whoIsPaying.value;
    let myExpense = +target.myExpense.value;
    let myFriendExpense = +target.myFriendExpense.value;

    handleSpillBill(whoIsPaying !== "user" ? myExpense : -myFriendExpense);
  }

  function handleTotalBill(e: FormEvent<HTMLInputElement>): void {
    setBill(isNaN(+e.currentTarget.value) ? "" : +e.currentTarget.value);
  }

  function handleIsMyPaid(e: FormEvent<HTMLInputElement>): void {
    let billPaid = +e.currentTarget.value;

    setIsMyBillPaid((myPaid) => {
      if (isNaN(billPaid)) {
        billPaid = +"";
        setMyFriendPaid(() => +bill - billPaid);
        return billPaid;
      }
      if (+bill < billPaid) {
        return myPaid;
      }

      setMyFriendPaid((friendPaid) => {
        if (bill === friendPaid) {
          return "";
        }
        return +bill - billPaid;
      });

      return billPaid;
    });
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectedFriend && selectedFriend.name}</h2>

      <label>💰 Bill Value</label>
      <input
        type="text"
        id="bill"
        value={`${bill}`}
        //onChange={(e) => setBill(isNaN(+e.target.value) ? "" : +e.target.value)}
        onChange={(e) => handleTotalBill(e)}
      />

      <label>🙎Your expenses </label>
      <input
        id="myExpense"
        type="text"
        value={`${isMyBillPaid}`}
        onChange={(e) => handleIsMyPaid(e)}
      />

      <label>🧑‍🤝‍🧑{selectedFriend?.name}'s expenses</label>

      <input
        id="myFriendExpense"
        type="text"
        value={`${myFriendPaid}`}
        disabled
      />

      <label>💵 Who is paying the bill.</label>
      <select
        id="whoIsPaying"
        value={`${whoIsPaying}`}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <button className="button">Split Bill</button>
    </form>
  );
}

interface HasFriendList {
  friends: AllFriendList;
  onSelectedFriend(friend: DataLists): void;
}

function FriendLists({ friends, onSelectedFriend }: HasFriendList) {
  return (
    <>
      {friends.map((friend: DataLists) => {
        return (
          <Friend
            friend={friend}
            onSelectedFriend={onSelectedFriend}
            key={+friend.id}
          />
        );
      })}
    </>
  );
}

interface HasPerEachFriend {
  friend: DataLists;
  onSelectedFriend(friend: DataLists): void;
}

function Friend({ friend, onSelectedFriend }: HasPerEachFriend) {
  return (
    <>
      <ul>
        <li className="">
          <img src={`${friend.image}`} alt={`${friend.name}`} />

          <h3>{friend.name}</h3>

          {+friend.balance < 0 ? (
            <p className="red">
              You owe {friend.name} {Math.abs(+friend.balance)}.
            </p>
          ) : null}

          {+friend.balance > 0 ? (
            <p className="green">
              {friend.name} owe You {+friend.balance}.
            </p>
          ) : null}
          {friend.balance === 0 ? <p>You and {friend.name} are even</p> : null}

          <button onClick={() => onSelectedFriend(friend)} className="button">
            Select
          </button>
        </li>
      </ul>
    </>
  );
}

interface FormAdd {
  handleAddFriend(friend: DataLists): void;
}

function FormAddFriend({ handleAddFriend }: FormAdd) {
  const [friend, setFriend] = useState<String>("");
  const [image, setImage] = useState<String>("https://i.pravatar.cc/48");

  interface AddFriend extends HTMLFormControlsCollection {
    friend: HTMLInputElement;
    image: HTMLInputElement;
  }

  interface ElemFormFriend extends HTMLFormElement {
    readonly elements: AddFriend;
  }

  function formAddFriend(e: FormEvent<ElemFormFriend>) {
    e.preventDefault();

    const target = e.currentTarget.elements;

    const friend = target.friend.value;
    const image = target.image.value;

    const id = crypto.randomUUID();
    const newFriend = {
      id: +id,
      name: `${friend}`,
      image: `${image}?id=${id}`,
      balance: 0,
    };

    handleAddFriend(newFriend);
    setFriend("");
    setImage("https://i.pravatar.cc/48");
    /*

    */
  }

  return (
    <>
      <form className="form-add-friend" onSubmit={formAddFriend}>
        <label>🧑‍🤝‍🧑Friend</label>
        <input
          id="friend"
          type="text"
          value={`${friend}`}
          onChange={(e) => setFriend(e.target.value)}
        />

        <label>🖼️ Image Url</label>
        <input
          id="image"
          type="text"
          value={`${image}`}
          onChange={(e) => setImage(e.target.value)}
        />

        <button type="submit" className="button">
          Select
        </button>
      </form>
    </>
  );
}

export default App;
