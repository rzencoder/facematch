import React from 'react';
import './FaceRecognition.scss';

interface FaceProps {
  imageUrl: string,
  boxes: any,
}

const FaceRecognition = ({ imageUrl, boxes }: FaceProps) => {
    let width = window.innerWidth < 400 ? '280px' : '500px';
    const faceBoxes = boxes.map(( box:any, i:number )=> {
      return ( 
        <div key={i} className="bounding-box" style={{
          top: box.topRow, right: box.rightCol, left: box.leftCol, bottom: box.bottomRow,
        }}>
        </div> 
      )
    });
    return (
      <div className="image-wrap">
          <div className="image-container">
              <img id="imageInput" src={imageUrl} alt="" width={width} height="auto"/>
              {faceBoxes}  
          </div>
      </div>
    )
};

export default FaceRecognition;
