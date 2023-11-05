import { Row, Col, Dropdown } from "react-bootstrap";
import PrayerCard from "./prayerCard/prayerCard";
import fajer from "../assets/img/fajer.jpg";
import dhohor from "../assets/img/dhohor.jpg";
import assar from "../assets/img/assar.jpg";
import maghreb from "../assets/img/maghreb.jpg";
import ichaa from "../assets/img/ichaa.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import { differenceInMilliseconds, format, parse } from 'date-fns';
import { ar } from 'date-fns/locale'; // Importez la locale arabe

export default function MainContent() {
    const [city, setCity] = useState({
      apiCity:"Tunis",
      cityName: "تونس"
    });
    const [fajerTime, setFajerTime] = useState("");
    const [dhohorTime, setDhohorTime] = useState("");
    const [assarTime, setAssarTime] = useState("");
    const [maghrebTime, setMaghrebTime] = useState("");
    const [ichaaTime, setIchaaTime] = useState("");
    const [date, setDate] = useState(new Date());

    useEffect(() => {
      axios.get(`https://api.aladhan.com/v1/timingsByCity?city=Tunisia&country=${city.apiCity}`)
      .then(res => (
                    setFajerTime(res.data.data.timings.Fajr),
                    setDhohorTime(res.data.data.timings.Dhuhr),                  
                    setAssarTime(res.data.data.timings.Asr),
                    setMaghrebTime(res.data.data.timings.Maghrib),                   
                    setIchaaTime(res.data.data.timings.Isha)           
      )) 
    },[city]);
      
    const formattedDate = format(date, 'EEEE yyyy.MM.dd | HH:mm:ss', { locale: ar }); 
      
    useEffect(() => {
       setInterval(() => {
        setDate(new Date()) 
       },1000)
    },[]);

    const targetTimes = [
        fajerTime, 
        dhohorTime,
        assarTime, 
        maghrebTime, 
        ichaaTime, 
      ]; 

       // Convertissez les heures cibles en objets Date pour faciliter la comparaison
       const targetDateObjects = targetTimes.map((targetTime) => parse(targetTime, 'HH:mm', new Date()));
 
      // Trouver l'heure la plus proche
      let differences = [];
      let differencesNegative = [];

       for (let i = 0; i < targetDateObjects.length; i++) {
        const difference = differenceInMilliseconds(date, targetDateObjects[i]);
        differences.push(difference);

        if (difference <= 0) {
          differencesNegative.push(difference);
        }
      } 
      let nearestTime = Math.max(...differencesNegative);
      let nearestTimeIndex = differences.indexOf(nearestTime);

    // The rested time for the next prayer
      let restedTime;
     switch(true) {
      case (nearestTime === -Infinity):
        restedTime = "";
      break;
      case (nearestTime !== -Infinity):
        restedTime = format((Math.abs(nearestTime) - 3600000), "HH:mm:ss", { locale: ar });
      break;
      default:
         restedTime = "";
     }

  // Nearest prayer name
      let nearestPrayer;
       switch(true) {
        case nearestTimeIndex === 0 :
         nearestPrayer = "الفجر";
        break;
        case nearestTimeIndex === 1 :
          nearestPrayer = "الظهر";
        break;
        case nearestTimeIndex === 2 :
         nearestPrayer = "العصر";
        break;
        case nearestTimeIndex === 3 :
          nearestPrayer = "المغرب";
        break;
        case nearestTimeIndex === 4 :
          nearestPrayer = "العشاء";
        break;
        default:
          nearestPrayer = "الفجر"; 
      } 

      
    return(
        <div>
          <Row className="py-5 ">
            <Col>
              <h4 className="d-flex justify-content-center">{formattedDate}</h4>
              <h2 className="d-flex justify-content-center">{city.cityName}</h2>
            </Col>
            <Col>
              <h4 className="d-flex justify-content-center">متبقي حتى صلاة {nearestPrayer} </h4>
              <h2 className="d-flex justify-content-center">{restedTime}</h2>
            </Col>
          </Row>

          <Row className="my-5 justify-content-center">
           <Col lg={2} md={6} xs={12} className="my-3"><PrayerCard image={fajer} name={"الفجر"} time={fajerTime}/></Col>
           <Col lg={2} md={6} xs={12} className="my-3"><PrayerCard image={dhohor} name={"الظهر"} time={dhohorTime}/></Col>
           <Col lg={2} md={6} xs={12} className="my-3"><PrayerCard image={assar} name={"العصر"} time={assarTime}/></Col>
           <Col lg={2} md={6} xs={12} className="my-3"><PrayerCard image={maghreb} name={"المغرب"} time={maghrebTime}/></Col>
           <Col lg={2} md={6} xs={12} className="my-3"><PrayerCard image={ichaa} name={"العشاء"} time={ichaaTime}/></Col>
          </Row>

          <div className="d-flex justify-content-center pb-5">
          <Dropdown>
           <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="px-5 py-2 fs-4">
             أختر المدينة
           </Dropdown.Toggle>

           <Dropdown.Menu>
            <Dropdown.Item  className="d-flex" value="Mannouba" name="منوبة" onClick={(e) => {setCity({apiCity: e.currentTarget.getAttribute('name'), cityName: e.currentTarget.getAttribute('name')})}} >منوبة</Dropdown.Item> 
            <Dropdown.Item  className="d-flex" value="Sfax" name="صفاقس" onClick={(e) => {setCity({apiCity: e.currentTarget.getAttribute('value'), cityName: e.currentTarget.getAttribute('name')})}} >صفاقس</Dropdown.Item>
            <Dropdown.Item  className="d-flex" value="Mednin" name="مدنين" onClick={(e) => {setCity({apiCity: e.currentTarget.getAttribute('value'), cityName: e.currentTarget.getAttribute('name')})}} >مدنين</Dropdown.Item> 
           </Dropdown.Menu>
          </Dropdown>
          </div>
        </div>
    )
}