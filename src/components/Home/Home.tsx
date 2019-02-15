import React, { Component } from "react";
import { Link } from "react-router-dom";
import ImageForm from "../ImageForm/ImageForm";
import FaceRecognition from "../FaceRecognition/FaceRecognition";
import Rank from "../Rank/Rank";

interface HomeProps {
  name: string;
  entries: number;
  id: number;
  updateEntries: any;
}

interface HomeState {
  boxes: any;
  imageUrl: string;
  input: string;
  message: string;
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      boxes: [],
      imageUrl: "",
      input: "",
      message: ""
    };
  }

  private calculateFaceLocation = (data: any) => {
    // Use api data to calculate face box data to display over image
    if (data && data.outputs) {
      const image = document.getElementById("imageInput") as HTMLCanvasElement;
      const width = image.width;
      const height = image.height;
      const faceParameters = data.outputs[0].data.regions;
      const boxes = faceParameters.map((face: any) => {
        const faceData = face.region_info.bounding_box;
        return {
          leftCol: faceData.left_col * width,
          topRow: faceData.top_row * height,
          rightCol: width - faceData.right_col * width,
          bottomRow: height - faceData.bottom_row * height
        };
      });
      return boxes;
    }
    return;
  };

  private displayFaceBoxes = (boxes: any): void => {
    if (boxes) {
      this.setState({ boxes });
    }
  };

  private onInputChange = (event: any): void => {
    this.setState({ input: event.target.value });
  };

  private onSubmit = () => {
    const input = this.state.input;
    const token: any = window.sessionStorage.getItem("token");
    this.setState({
      imageUrl: input
    });
    fetch("/imageurl", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      },
      body: JSON.stringify({
        input: input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch("/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              authorization: token
            },
            body: JSON.stringify({
              id: this.props.id
            })
          })
            .then(res => res.json())
            .then(data => {
              this.props.updateEntries(data);
            })
            .catch(err =>
              this.setState({ message: "Error loading User Data" })
            );
        }
        this.displayFaceBoxes(this.calculateFaceLocation(response));
      })
      .catch(err => this.setState({ message: "Error loading API" }));
  };

  render() {
    const { boxes, imageUrl } = this.state;
    return (
      <div>
        <div>
          <Rank name={this.props.name} entries={this.props.entries} />
          <div className="face-search-container">
            <ImageForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
