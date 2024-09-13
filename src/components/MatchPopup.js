import { Link, useNavigate } from "react-router-dom";
function MatchPopup({
  toggleModal,
  modal,
  idUserChoosen,
  nameUserChoosen,
  ageUserChoosen,
  profPicUserChoosen,
  matchesId,
}) {
  const storedImagePet = localStorage.getItem("imagePet");
  const navigate = useNavigate();
  const handleStartChat = () => {
    navigate("/message", {
      state: {
        idUserChoosen: idUserChoosen,
        nameUserChoosen: nameUserChoosen,
        ageUserChoosen: ageUserChoosen,
        profPicUserChoosen: profPicUserChoosen,
        matchesId: matchesId,
      },
    });
  };
  return (
    <>
      {modal && (
        <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center">
          <div
            onClick={toggleModal}
            className="absolute inset-0 bg-[rgba(49,49,49,0.8)]"
          ></div>
          <div className="relative bg-white p-4 rounded-md max-w-lg min-w-sm z-50">
            <div className=" bg-white flex flex-col items-center justify-center p-4">
              <h1 className="text-4xl font-bold text-orange-500 text-center mb-4">
                Congratulations
              </h1>
              <h2 className="text-2xl text-orange-400 text-center mb-8">
                It's a match!
              </h2>

              <div className="relative flex items-center justify-center mb-8">
                <div className="relative flex items-center justify-center">
                  <img
                    src={`http://localhost:8082/images/profpic/${storedImagePet}`}
                    alt="image"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                  <img
                    src={`http://localhost:8082/images/profpic/${profPicUserChoosen}`}
                    alt="image"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg ml-8"
                  />
                </div>
                <div className="absolute -top-8 -left-8 w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg"></div>
                <div className="absolute -top-8 -right-8 w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg"></div>
              </div>

              <p className="text-center text-orange-400 mb-12">
                Chat to Bara to see what his interests are and start playing
                your favourite games together!
              </p>
              {/* <Link to={"/message"}> */}
              <button
                onClick={handleStartChat}
                className="bg-orange-500 text-white text-lg font-medium py-3 px-6 rounded-full shadow-md hover:bg-orange-700 transition duration-300"
              >
                Start Chat
              </button>
              {/* </Link> */}
            </div>
            {/* <button className="absolute top-3 right-10" onClick={toggleModal}>
              CLOSE
            </button> */}
          </div>
        </div>
      )}
    </>
  );
}

export default MatchPopup;
