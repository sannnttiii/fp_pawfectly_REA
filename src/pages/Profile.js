import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [petTypeIsDog, setPetTypeIsDog] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [petBreeds, setPetBreeds] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");

  const id = parseInt(localStorage.getItem("userID"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/getProfile?id=${id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("profile", data);

          setPetTypeIsDog(data.petType === "dog");
          setPetBreeds(
            data.petBreeds ||
              (data.petType === "dog" ? "Golden Retriever" : "Persian")
          );
          setGender(data.gender || "male");
          setName(data.name || "");
          setAge(data.age || "");
          setCity(data.city || "");
          setBio(data.bio || "");
          if (data.image) {
            console.log(data.image + "UAJODJD");
            setImagePreview(
              `http://localhost:8082/images/profpic/${data.image}`
            );
            console.log(imagePreview);
          }
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // update foto kalau diganti aja
    if (image) {
      formData.append("image", image);
    }
    formData.append("pet_breeds", petBreeds);
    formData.append("gender", gender);
    formData.append("name", name);
    formData.append("age", age);
    formData.append("city", city);
    formData.append("bio", bio);
    formData.append("id", id);

    try {
      const response = await fetch("http://localhost:8082/api/setProfile", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("imagePet", data.image_pet);
        navigate("/homepage");
        console.log("Update profile success");
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Error update:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setImage(files[0]);

      // Create a preview URL for the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else if (name === "petBreeds") {
      setPetBreeds(value);
    } else if (name === "gender") {
      setGender(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "age") {
      setAge(value);
    } else if (name === "city") {
      setCity(value);
    } else if (name === "bio") {
      setBio(value);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-200">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray w-4/5">
          <h1 className="text-4xl font-semibold">Pet's Profile</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">
            Tell us more about your paw-friend!
          </p>
          <form onSubmit={handleProfile}>
            <div className="mt-8">
              <input type="hidden" name="id" value={id} />
              <label className="text-lg font-medium" htmlFor="petImage">
                Pet Image (Ratio 3:4)
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mb-4 w-1/2 object-cover border-2 border-gray-100 rounded-xl"
                />
              )}
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent"
                onChange={handleChange}
              />

              <label className="text-lg font-medium" htmlFor="petType">
                Pet Breeds
              </label>

              <select
                id="petBreeds"
                name="petBreeds"
                value={petBreeds}
                className="w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent"
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select pet breeds
                </option>
                {petTypeIsDog ? (
                  <>
                    <option value="Golden Retriever">Golden Retriever</option>
                    <option value="Border Collie">Border Collie</option>
                    <option value="Labrador Retriever">
                      Labrador Retriever
                    </option>
                    <option value="Poodle">Poodle</option>
                    <option value="Shih Tzu">Shih Tzu</option>
                    <option value="Beagle">Beagle</option>
                    <option value="German Shepherd">German Shepherd</option>
                    <option value="Bulldog">Bulldog</option>
                    <option value="Corgi">Corgi</option>
                    <option value="Chihuahua">Chihuahua</option>
                    <option value="Pomeranian">Pomeranian</option>
                    <option value="Siberian Husky">Siberian Husky</option>
                    <option value="Mix">Mix</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Persian">Persian</option>
                    <option value="Anggora">Anggora</option>
                    <option value="Siam">Siam</option>
                    <option value="Ragdoll">Ragdoll</option>
                    <option value="Himalaya">Himalaya</option>
                    <option value="British Shorthair">British Shorthair</option>
                    <option value="American Shorthair">
                      American Shorthair
                    </option>
                    <option value="Scottish Fold">Scottish Fold</option>
                    <option value="Mix">Mix</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>

              <label className="text-lg font-medium" htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={gender}
                className="w-full border-2 border-gray-100 rounded-xl p-4 bg-transparent"
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <label className="text-lg font-medium">Name</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                type="text"
                placeholder="Enter your pet's name"
                name="name"
                value={name}
                onChange={handleChange}
              />
              <div>
                <label className="text-lg font-medium">Age</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  type="text"
                  placeholder="Enter your pet's age"
                  name="age"
                  value={age}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-lg font-medium">City</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  type="text"
                  name="city"
                  placeholder="Enter the city your pet's live"
                  value={city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-lg font-medium">About me</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="Enter a brief description about your pet's personality, likes, hobby and etc"
                />
              </div>
              <div className="mt-8 flex flex-col gap-y-4">
                <button
                  className="w-full bg-orange-500 text-white text-lg font-bold py-3 rounded-xl hover:bg-orange-700"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className=" lg:flex h-full w-1/2 hidden relative items-center justify-center">
        {/* <div className="flex flex-col items-center justify-center h-full"> */}
        <div class="paw-print-1">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-2">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-3">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-4">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-5">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>

        <div class="paw-print-6">
          <div class="pad large"></div>
          <div class="pad small-1"></div>
          <div class="pad small-2"></div>
          <div class="pad small-3"></div>
          <div class="pad small-4"></div>
        </div>
        {/* <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"></div> */}
      </div>
    </div>
  );
}

export default Profile;
