import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CardPet from "../components/CardPet";
import Select from "react-select";

function Homepage() {
  const [petTypeIsDog, setPetTypeIsDog] = useState(true);
  const [pets, setPets] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const petType = localStorage.getItem("petType");
    if (petType === "cat") {
      setPetTypeIsDog(false);
    } else {
      setPetTypeIsDog(true);
    }

    const fetchPets = async () => {
      try {
        const id = parseInt(localStorage.getItem("userID"));

        const response = await fetch(`http://localhost:8082/api/pets?id=${id}`);
        const data = await response.json();
        console.log(data);
        setPets(data || []);
      } catch (error) {
        console.error("Error fetching pet data:", error);
        setPets([]);
      }
    };

    fetchPets();
  }, []);

  const options = petTypeIsDog
    ? [
        { value: "all", label: "All" },
        { value: "Golden Retriever", label: "Golden Retriever" },
        { value: "Border Collie", label: "Border Collie" },
        { value: "Labrador Retriever", label: "Labrador Retriever" },
        { value: "Poodle", label: "Poodle" },
        { value: "Shih Tzu", label: "Shih Tzu" },
        { value: "Beagle", label: "Beagle" },
        { value: "German Shepherd", label: "German Shepherd" },
        { value: "Bulldog", label: "Bulldog" },
        { value: "Corgi", label: "Corgi" },
        { value: "Chihuahua", label: "Chihuahua" },
        { value: "Pomeranian", label: "Pomeranian" },
        { value: "Siberian Husky", label: "Siberian Husky" },
        { value: "Mix", label: "Mix" },
        { value: "Other", label: "Other" },
      ]
    : [
        { value: "all", label: "All" },
        { value: "Persian", label: "Persian" },
        { value: "Anggora", label: "Anggora" },
        { value: "Siam", label: "Siam" },
        { value: "Ragdoll", label: "Ragdoll" },
        { value: "Himalaya", label: "Himalaya" },
        { value: "British Shorthair", label: "British Shorthair" },
        { value: "American Shorthair", label: "American Shorthair" },
        { value: "Scottish Fold", label: "Scottish Fold" },
        { value: "Mix", label: "Mix" },
        { value: "Other", label: "Other" },
      ];

  const handleChangeFilter = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  let filteredData = [];
  if (pets.length > 0) {
    filteredData =
      selectedOption && selectedOption.value !== "all"
        ? pets.filter(
            (item) =>
              (petTypeIsDog ? "dog" : "cat") === item.petType &&
              item.petBreeds === selectedOption.value
          )
        : pets.filter(
            (item) => (petTypeIsDog ? "dog" : "cat") === item.petType
          );
  }

  const cards = filteredData.map((item) => (
    <CardPet key={item.id} item={item} />
  ));

  return (
    <div>
      <Navbar />
      <div className="w-1/6 m-6">
        <label htmlFor="filter">Filter Category: </label>
        <Select
          value={selectedOption}
          onChange={handleChangeFilter}
          options={options}
        />
      </div>
      <div className="flex items-center justify-center min-h-screen container mx-auto">
        {filteredData.length === 0 ? (
          <div>
            <p>
              There's no pet to match for you. Please try adjusting your filters
              or come back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cards}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
