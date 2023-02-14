import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { storage, db } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import {
  updateDoc as update,
  deleteDoc as del,
  doc,
  getDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Card } from "react-bootstrap";

export default function Detail() {
  // to get the postId we use useParams
  let uId = localStorage.getItem("uid");
  const [modalShow, setModalShow] = useState(false);
  const params = useParams();
  let postId = params.postId;
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  let right = false;
  const getPostById = async (id) => {
    const docRef = doc(db, "Articles", id);
    const result = await getDoc(docRef);
    return result;
  };

  useEffect(() => {
    getPostById(postId).then((value) => setData(value.data()));
  }, []);

  if (data == null) {
    return <h1>Loading...</h1>;
  }

  // function to delete the post
  const deletePost = () => {
    const deleteRef = doc(db, "Articles", `${postId}`);
    del(deleteRef);
    navigate("/");
  };

  function MyVerticallyCenteredModal(props) {
    const [value, setvalue] = useState({
      title: props.daata.title,
      description: props.daata.description,
    });
    const [Image, setImage] = useState();
    const [url, setUrl] = useState();
    const handleChange = (name) => (e) => {
      e.preventDefault();
      setvalue({ ...value, [name]: e.target.value });
    };

    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };

    // function for updating the docs
    const { title, description } = value;
    const updateDoc = () => {
      if (!Image) {
        toast.error("Please Fill all the fields");
        return;
      }
      console.log(Image.name);
      const storageRef = ref(storage, `/images/${Date.now()}${Image.name}`);
      const uploadImage = uploadBytesResumable(storageRef, Image);

      uploadImage.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          console.log(err);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then((url) => {
            setUrl(url);
          });
        }
      );
      console.log(url);
      // function for updating the data
      const updateRef = doc(db, "Articles", `${postId}`);

      update(updateRef, {
        title: title,
        description: description,
        imageUrl: url,
        uid: uId,
      })
        .then(() => {
          toast.success("Post Updated");
        })
        .catch((err) => {
          toast.error("Something Went Wrong.");
        });
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <form onSubmit={updateDoc}> */}
          <label htmlFor="">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={title}
            onChange={() => handleChange("title")}
          />
          <label htmlFor="">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={description}
            onChange={() => handleChange("description")}
          />
          <label htmlFor="">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-control"
            onChange={(e) => handleImageChange(e)}
          />
          <Button variant="primary" onClick={(e) => updateDoc()}>
            Upload
          </Button>
          {/* </form> */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div className="border mt-3 p-3 bg-light" style={{display:"flex", justifyContent:"center"}}>
      <ToastContainer />
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={data.imageUrl} alt="title" />
        <Card.Body>
          <Card.Title>{data.title}</Card.Title>
          <Card.Text>{data.description}</Card.Text>
          <Button
            variant="primary"
            onClick={() => {
              setModalShow(true);
            }}
          >
            {" "}
            Update{" "}
          </Button>
          <Button style={{margin: "4px"}}            variant="primary"
            onClick={(e) => {
              deletePost();
            }}
          >
            {" "}
            Delete{" "}
          </Button>
        </Card.Body>
      </Card>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        daata={data}
      />
    </div>
  );
}
