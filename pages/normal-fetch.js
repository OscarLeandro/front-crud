import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import EditModal from "../components/EditModal";

export default function NormalFetch() {
  const router = useRouter();
  const [typeButton, setTypeButton] = useState(null);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentCard, setCurrentCard] = useState(null)

  const [inputCard, setInputCard] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setData(null);

    getData("https://card-crud.vercel.app/api/cards/")
      .then((dataFetching) => {
        setData(dataFetching);
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  async function getData(url = "") {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }
  async function postData(url = "", body = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }
  async function updateData(url = "", body = {}) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }
  async function deleteData(url = "") {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  async function addCard(event, body) {
    setTypeButton("add");
    event.preventDefault();
    console.log("este es el body", body);

    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      setIsSuccess(true);
      setIsLoading(false);
      const newCard = await postData("https://card-crud.vercel.app/api/cards/", body);
      setData([...data, newCard]);

      setInputCard("");
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error);
    }

    // si es exitosa, guarde como último la nueva carta, además de mostrar el loading, error,/listo
  }

  async function onDelete(id) {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      setIsLoading(false);
      setIsSuccess(true);
      const deletedCard = await deleteData(
        `https://card-crud.vercel.app/api/cards/${id}`
      );
      setData(data.filter((card) => card.name !== deletedCard.name));
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error);
    }
  }
  async function onUpdate(card) {
    setTypeButton("update");
    setCurrentCard(card)
    setInputCard(card.name)

    
  }
  
  //FUNCION DE PRUEBA
  async function updateCard(event,body){
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    event.preventDefault();
    try {
      let updateCard = {
        id: currentCard._id,
        name:body.name
      }
      setIsLoading(false);
      setIsSuccess(true);
      const updatedCard = await updateData(`https://card-crud.vercel.app/api/cards/${currentCard._id}`,updateCard)
      console.log('carta actualizada',updatedCard)
      //console.log('data', data)
      const a = [...data.map(card => card._id == updatedCard._id ? {...card, ...updatedCard}:card)]
      console.log(a);
      setData(a)
      setInputCard('')
      //card.id == updatedCard._id ? {...card, ...updatedCard}:card)
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error);
    }
    
  }
  

  return (
    <>
      <div className="container mx-auto">
        <EditModal open={open} setOpen={setOpen} />
        <h1 className="font-bold text-5xl">normal-fetch</h1>
        <button
          className="p-2 bg-red-500 border border-red-300"
          onClick={() => router.push("/")}
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>

        <div className="text-center mx-96">
          {isLoading && <p> Loading...</p>}
          {isError && <p> ERROR!</p>}
          {isSuccess &&
            data.map((card) => (
              <div className="border mt-2 flex justify-end " key={card._id}>
                <p className="mx-auto">{card.name}</p>
                <button
                  onClick={() => onUpdate(card)}
                  className="border-yellow-600 bg-yellow-500 mr-2 text-white p-1 justify-items-end"
                >
                  Update
                </button>
                <button
                  onClick={() => onDelete(card._id)}
                  className="border-red-600 bg-red-500 text-white p-1 justify-items-end"
                >
                  Delete
                </button>
              </div>
            ))}
          {data === null && <p> Sin data aun</p>}
        </div>

        <form className="my-20 text-center">
          <input
            onChange={(e) => setInputCard(e.target.value)}
            className="p-3 border border-indigo-300"
            type="text"
            value={ inputCard }
          />

          <button
            className="rounded-full border bg-green-500 p-2 mx-3"
            onClick={(event) =>
              addCard(event, {

                name: inputCard,
              })
            }
          >
            ADD SOME CARD
          </button>
          {typeButton == "update" && (
            <button className="rounded-full border bg-yellow-500 p-2 ml-1"
            onClick={(event) =>
              updateCard(event, {
                name: inputCard
              })
            }
            >
              UPDATE
            </button>
          )}
        </form>
      </div>
    </>
  );
}
