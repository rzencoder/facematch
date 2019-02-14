import React from "react";
import { Link } from "react-router-dom";
import ImageForm from "../ImageForm/ImageForm";
import FaceRecognition from "../FaceRecognition/FaceRecognition";
import Rank from "../Rank/Rank";

interface HomeProps {
  user: any;
  onInputChange: any;
  onSubmit: any;
  boxes: any;
  imageUrl: string;
}

const Home = (props: HomeProps) => (
  <div>
    <div>
      <Rank name={props.user.name} entries={props.user.entries} />
      <div className="face-search-container">
        <ImageForm
          onInputChange={props.onInputChange}
          onSubmit={props.onSubmit}
        />
        <FaceRecognition boxes={props.boxes} imageUrl={props.imageUrl} />
      </div>
    </div>
  </div>
);

export default Home;
