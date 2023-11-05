import "./prayerCard.css";
import Card from 'react-bootstrap/Card';

export default function PrayerCard({image, name, time}) {

    return(
       <Card>
        <Card.Img variant="top" src={image} style={{height:"100px"}}/>
        <Card.Body>
         <Card.Title className="fs-3">{name}</Card.Title>
         <Card.Text className="fs-3">
          {time}
         </Card.Text>
        </Card.Body>
       </Card>
    )
} 