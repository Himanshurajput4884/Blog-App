import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, {useState} from "react";
import { toast, ToastContainer } from 'react-toastify'
import { storage, db } from '../firebase'

export default function CreatePost() {
  const [formdata, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: Timestamp.now().toDate(),
  })
  let uId = localStorage.getItem("uid");
  const handleChange = (e)=>{
      setFormData({...formdata, [e.target.name]: e.target.value})
  };

  const handleImageChange = (e) =>{
      setFormData({...formdata, image:e.target.files[0]})
  };

  const handlePost = () => {
    if (!formdata.title || !formdata.description || !formdata.image) {
      alert("Please fill all the fields");
      return;
    }


    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formdata.image.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formdata.image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          image: "",
        });

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const articleRef = collection(db, "Articles");
          addDoc(articleRef, {
            title: formdata.title,
            description: formdata.description,
            imageUrl: url,
            uid: uId,
            createdAt: Timestamp.now().toDate(),
          })
            .then(() => {
              toast.success("Article added successfully");
            })
            .catch((err) => {
              toast.error("Error adding article");
            });
        });
      }
    );
  }
  return (
    <div className="border p-3 mt-3 bg-light">
      <ToastContainer/>
      <h2>Create Post</h2>
      <label htmlFor="">Title</label>
      <input type="text" name="title" className="form-control" value={formdata.title} onChange = {(e) => handleChange(e)}/>
      {/* description */}
      <label htmlFor="">Description</label>
      <textarea name="description" className="form-control" value={formdata.description} onChange = {(e) => handleChange(e)}/>
      {/* image */}
      <label htmlFor="">Image</label>
      <input type="file" name="image" accept="image/*" className="form-control" onChange = {(e) => handleImageChange(e)}/>
      <button className="form-control btn-primary mt-2" onClick={()=>{
        handlePost();
      }}>Upolad</button>
    </div>
  );
}
