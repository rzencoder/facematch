import React, { Component } from 'react';
import ImageForm from '../components/ImageForm/ImageForm';
import Navigation from '../components/Navigation/Navigation';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Rank from '../components/Rank/Rank';
import SignIn from '../components/SignIn/SignIn';
import Home from '../components/Home/Home';
import Profile from '../components/Profile/Profile';

interface AppProps {

}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'landing',
  isSignedIn: false,
  errorMessage: '',
  user: {
    id: 0,
    name: '',
    username: '',
    entries: 0,
    joined: new Date(),
    avatar: '1',
    location: ' '
  },
};

interface AppState {
  input: string,
  imageUrl: string,
  boxes: any,
  route: string,
  isSignedIn: boolean,
  errorMessage: string,
  user: {
    id: number,
    name: string,
    username: string,
    entries: number,
    joined: string,
  },
}
type State = Readonly<typeof initialState>

class App extends Component {
  readonly state: State = initialState;

  private loadUser = (data:any) : void => {
    this.setState({
      user: {
        id: data.id,
        username: data.username,
        name: data.name,
        entries: data.entries,
        joined: data.joined,
        avatar: data.avatar,
        location: data.location
      },
    });
  }

  private calculateFaceLocation = (data:any) => {
    // Use api data to calculate face box data to display over image
    const image = document.getElementById('imageInput') as HTMLCanvasElement;
    const width = image.width;
    const height = image.height;
    const faceParameters = data.outputs[0].data.regions;
    const boxes = faceParameters.map((face:any) => {
      const faceData = face.region_info.bounding_box;
      return {
        leftCol: faceData.left_col * width,
        topRow: faceData.top_row * height,
        rightCol: width - (faceData.right_col * width),
        bottomRow: height - (faceData.bottom_row * height),
      };
    })
    return boxes;
  }

  private displayFaceBoxes = (boxes: any) : void => {
    this.setState({ boxes });
  }

  private onInputChange = (event: any) : void => {
    this.setState({ input: event.target.value });
  }

  private onSubmit = () => {
    const input = this.state.input;
    this.setState({
      imageUrl: input,
    });
    fetch('/imageurl', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response) {
          fetch('/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then(res => res.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(err => this.setState({errorMessage: 'Error loading User Data'}));
        }
        this.displayFaceBoxes(this.calculateFaceLocation(response));
      })
      .catch(err => this.setState({errorMessage: 'Error loading API'}));
  }

  onRouteChange = (route:string) : void => {
    if (route === 'landing') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true,
      route: route });
    } else {
      this.setState({
        route: route
      });
    }
  }

  updateProfile = (data: any) => {
    this.setState({
      route: 'home',
      user: {
        name: data.name,
        username: data.username,
        location: data.location,
        avatar: data.avatar
      }
    })
  }

  render() { 
    const {
      isSignedIn, imageUrl, route, boxes,
    } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'landing' ?
          <Home onRouteChange={this.onRouteChange}/> :
          route === 'home'
          ? 
          <div>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <div className="face-search-container">
              <ImageForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
              <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
            </div>
          </div>
          :  
          route === 'profile' ? 
          <Profile onRouteChange={this.onRouteChange} user={this.state.user} updateProfile={this.updateProfile}/> :
          <SignIn route={route} loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        }
      </div>
    );
  }
}

export default App;
