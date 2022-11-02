import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {ArrowLeftIcon} from '@heroicons/react/24/outline'

export default function FetchReactQuery() {


  const [inputCard, setInputCard] = useState('')

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

  const mutation = useMutation((body) => {
    return postData("https://card-crud.vercel.app/api/cards/", body);
  });

  console.log(mutation)

  const router = useRouter();

  const propsReactQuery = useQuery(["cards"], () =>
    getData("https://card-crud.vercel.app/api/cards/")
  );

  const { isLoading, isError, isSuccess, data } = propsReactQuery;
  return (
    
    <div className="container mx-auto ">
    <h1 className="font-bold text-5xl">fetch-react-query.js</h1>
      <button
        className="p-3 border bg-red-500 border-red-300"
        onClick={() => router.push("/")}
      >
        <ArrowLeftIcon className='h-6 w-6' />
      </button>
      <div className="text-center mx-96">
      {isLoading && <p> Loading...</p>}
      {isError && <p> ERROR!</p>}

      {isSuccess && data.map((card) => <p className="border p-1" key={card._id}> {card.name} </p>)}

      {data === null && <p> Sin data aun</p>}

      </div>
      <div className="text-center mt-20">
      <input onChange={(e) => setInputCard(e.target.value) } className="p-3 border border-indigo-300" type="text" />
      <button
      className="rounded-full border bg-green-500 p-2 mx-3"
        onClick={() => {
          mutation.mutate({ name: inputCard });
        }}
      >
        ADD SOME CARD
      </button>

      </div>

    </div>
  );
}
