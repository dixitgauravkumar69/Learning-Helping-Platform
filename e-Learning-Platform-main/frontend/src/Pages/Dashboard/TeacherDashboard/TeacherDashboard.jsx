import React, { useEffect, useState } from 'react';
import teachingImg from '../../Images/Teaching.svg';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import logo from '../../Images/logo1.png';

function TeacherDashboard() {
  const { ID } = useParams();
  const navigator = useNavigate();
  const [data, setData] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  const handleLogout = async () => {
    const response = await fetch(`/api/teacher/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    if (data.statusCode === 200) {
      navigator('/');
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
  
    // Prepare FormData (this will handle both text fields and file upload)
    const formData = new FormData();
    formData.append('teacherId', ID);
    formData.append('courseName', courseName);
    formData.append('courseDescription', courseDescription);
    formData.append('courseFile', document.getElementById('courseFile').files[0]);
  
    try {
      // Send the form data to the backend
      const response = await fetch(`/api/Teacher/AddCourse`, {
        method: 'POST',
        body: formData, // Use FormData instead of JSON.stringify
      });
  
      if (response.ok) {
        const newCourse = await response.json();
        setData((prevData) => [...prevData, newCourse]);
        setCourseName('');
        setCourseDescription('');
      } else {
        console.error('Failed to add course');
      }
    } catch (error) {
      console.error('Error uploading course:', error);
    }
  };
  

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        console.log("Response Status:", response.status); // ✅ Log status
        console.log("Response Headers:", response.headers); // ✅ Log headers
  
        const text = await response.text();
        console.log("Raw Response:", text); // ✅ Log raw response
  
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
  
        const user = JSON.parse(text); // ✅ Safely parse JSON
        setData(user.data);
  
      } catch (error) {
        console.error("Error fetching data:", error.message); // ✅ Fix error logging
      }
    };
  
    if (ID) getData(); // ✅ Only fetch if ID exists
  }, [ID]);
  return (
    <>
      {/* navbar */}
      <nav className='bg-[#04253A] px-10 py-3 flex justify-between items-center'>
        <NavLink to="/">
          <div className='flex items-center gap-3'>
            <img src={logo} className="w-14" alt="" />
            <h1 className='text-2xl text-[#4E84C1] font-bold'>DevSync</h1>
          </div>
        </NavLink>
        <div className='bg-[#0D199D] text-white py-2 px-5 rounded-full'>
          <p onClick={handleLogout}>logout</p>
        </div>
      </nav>

      <div className='bg-[#008280] flex justify-between items-center'>
        <div className=' text-[#071645] font-semibold text-5xl ml-72'>
          <h1 className='mb-5'>Welcome to <span className='text-white'>DevSync</span></h1>
          <h3 className='ml-16 text-[#071645]'>{data.Firstname} {data.Lastname}</h3>
        </div>
        <div className='m-5 mr-20'>
          <img src={teachingImg} alt="teaching" width={300} />
        </div>
      </div>

      {/* sidebar */}
      <div className='bg-[#071645] w-52 h-full absolute top-20'>
        <div className='flex flex-col gap-5 text-xl items-center text-white mt-8 mb-10'>
          <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="profile_img" width={50} />
        </div>

        <div className='flex flex-col gap-1'></div>
        <div className='flex flex-col gap-1'>
         

         
            <NavLink to={`/Teacher/Dashboard/${ID}/AddCourse`} className={({ isActive }) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#4E84C1]" : "p-3 text-center font-semibold text-[#4E84C1]"}> 
            UploadCourses
            </NavLink>
            
          <NavLink to={`/Teacher/Dashboard/${ID}/ViewCourses`} className={({ isActive }) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#4E84C1]" : "p-3 text-center font-semibold text-[#4E84C1]"}> 
            View Courses
          </NavLink>

          <NavLink to={`/Teacher/Dashboard/${ID}/GenerateQuiz`} className={({ isActive }) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#4E84C1]" : "p-3 text-center font-semibold text-[#4E84C1]"}> 
            Generate Quiz
          </NavLink>
          
        </div>
      </div>

    
      
    </>
  );
}

export default TeacherDashboard;
