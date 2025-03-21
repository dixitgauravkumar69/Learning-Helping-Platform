import React, { useState } from 'react'
import '../Landing/Landing.css'
import Footer from '../../Footer/Footer'
import Header from '../Header/Header'

function Courses() {
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(true);

  const teachersList = async(sub)=>{
    setLoading(true);

    const response = await fetch(`/api/course/${sub}`, {
      method: 'GET',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    setFacList(data.data);
    console.log(data.data);
    setLoading(false);
  }

  return (
    <>
    <Header/>
    <div className="courses">
      <p>Course List</p>
      <hr className="underLine"/>
      <div className="subjects">
        <div className="subject" onClick={()=>teachersList("react")}>
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2" alt="Physics" />
          <p>React</p>
        </div>
        <div className="subject" onClick={()=>teachersList("fullstack")}>
          <img src="https://cdn-icons-png.flaticon.com/512/6674/6674591.png" alt="Chemistry" />
          <p>Fullstack</p>
        </div>
        <div className="subject" onClick={()=>teachersList("mongodb")}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgtcWBG_rlWt611si6eqW-vMeebSSMygWgknaJb8wY-Uv4UN0H-arxrzg03Y9X9ftnb9Y&usqp=CAU" alt="photo" />
          <p>Mongodb</p>
        </div>
        <div className="subject" onClick={()=>teachersList("Aptitude")}>
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664" alt="Math" />
          <p>Aptitude</p>
        </div>
        <div className="subject" onClick={()=>teachersList("computerNetwork")}>
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272" alt="Computer" />
          <p>Computer Network</p>
        </div>
        
      </div>

      <div className="flex items-center justify-center gap-10">
        {!loading && facList && (
          facList.map(fac => (
          <div key={fac._id} className="bg-[#99afbc] p-5 rounded-md ">
            <div className="flex gap-3 items-center mb-2 ">
            <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="profile_img" width={50} />
            <div className="flex flex-col justify-center items-start pl-3">
            <p>{fac.enrolledteacher.Firstname} {fac.enrolledteacher.Lastname}</p>
            <h4 className="text-blue-900">{fac.enrolledteacher.Email}</h4>
            </div>
            </div>
            { fac.enrolledteacher.Email === "urttsg@gmail.com" ?
              <h4><span className="font-bold text-brown-800">Education :</span> Post graduate from Calcutta University</h4> 
              : 
              <h4><span className="font-bold text-brown-800">Education :</span> Post graduate from Sister Nivedita university</h4>
            }
            { fac.enrolledteacher.Email === "urttsg@gmail.com" ? <h4>1 years of teaching experience</h4> : <h4>2 years of teaching experience</h4>}
          </div>
        )))}
      </div>

      </div>
    <Footer/>
    </>
  )
}

export default Courses