import { collection,onSnapshot,orderBy,query, } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Home() {
  const [articles, setArticles] = useState([]);
  // to fetching articles from database.
  const navigate = useNavigate();
  useEffect(() => {
    const articleRef = collection(db, "Articles");
    const q = query(articleRef, orderBy("createdAt", "desc"));
    // then to get the data, we use snapshot
    onSnapshot(q, (snapshot) => {
      const articles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(articles);
      // console.log("Articles -> "+articles);
    });
  }, []);

  let uId = localStorage.getItem("uid");

  return (
    <div className="container">
      <div className="row">
        <div className="col-mt-8">
          <h2>Posts</h2>
          {articles.length === 0 ? (
            <p> No Article Found...</p>
          ) : (
            articles.map((post) => (
              <div className="border mt-3 p-3 bg-light" key={post.id}>
                <div className="row">
                  <div className="col-3">
                    <img
                      src={post.imageUrl}
                      alt="title"
                      style={{ height: 180, width: 180 }}
                    ></img>
                  </div>
                  <div className="col-9 ps-3">
                    <h2>{post.title}</h2>
                    <p>{post.createdAt.toDate().toDateString()}</p>
                    <h6>{post.description}</h6>
                    {(post.uid===localStorage.getItem("uid")) ? <Button variant="success" onClick={()=>{navigate(`/detail/${post.id}`)}}> View </Button> : <p></p>}          
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
