import React, { useContext, useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import profilpic from "../../assets/profile-svg.svg";
import loss from "../../assets/loss.svg";
import win from "../../assets/win.svg";
import { AuthContext } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import BackendURL from "../../utils/config.js";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [userProfile , setUserProfile ]= useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchUserProfile = async () => {
      if (!user) {
        showToast("Not logged in", "error");
        navigate("/sign-in");
        return;
      }

      try {
        const id = user;
        const resp = await fetch(`${BackendURL}/api/profile/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (resp.ok) {
          const data = await resp.json();
          setUserProfile(data);
          console.log("profile data : " , data)
        } else {
          // Handle non-200 response codes
          showToast("Error fetching User", "error");
          navigate("/sign-in");
        }
      } catch (error) {
        // Catch any errors during the fetch
        showToast("Error fetching User", "error");
        navigate("/sign-in");
      }
    };

    fetchUserProfile();
   
  }, [user]);



  return (
    <div className="h-screen w-full text-white ">
      <SideBar />
      <div className="ml-32 py-20 px-10 flex gap-5">
        <div className="h-full bg-zinc-900 w-[25rem] p-5 rounded-xl font-ChakraPetch ">
          <div className="flex flex-col justify-center w-full space-y-2">
            <img src={profilpic} alt="" />
            <h1 className="text-center font-bold text-3xl py-6">
              {userProfile?.user?.name}
            </h1>
            <h1 className="px-10 "> Games Played : </h1>
            <h1 className="px-10 "> Games Won : </h1>
            <h1 className="px-10 "> Email ID : </h1>
          </div>
        </div>

        <div className="flex-grow h-full p-5 rounded-xl ">
          <GameCard img={win} />
          <GameCard img={loss} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

function GameCard({ img, color }) {
  return (
    <div className="bg-zinc-900 flex justify-between w-full h-full rounded-xl p-5 mb-10 ">
      <div>
        <img src={img} alt="icon" className="size-20 " />
      </div>
      <div>
        <h1>Game ID : </h1>
        <h1>Opponent : </h1>
        <h1>Result : </h1>
      </div>
    </div>
  );
}
