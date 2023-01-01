import React, {useEffect, useState} from "react";
import {createApi} from "unsplash-js";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Card, Carousel, Col, Container, ListGroup, Row} from "react-bootstrap";
import {LatLngTuple} from "leaflet";
import {v4 as uuid} from 'uuid';
import './index.scss';
import {ImMail4} from "react-icons/im";
import {BsFillTelephoneFill} from "react-icons/bs";
import {Loading} from "../../components/motions";


const randomEmail = require('random-email');
const createMobilePhoneNumber = require("random-mobile-numbers");
const Fakerator = require("fakerator");
const fakerator = Fakerator("en-CA");


type DataFromFakeGenerator = {
    first_name: string,
    last_name: string,
    location: {
        street: string,
        city: string,
        state: string,
        country: string
    },
    contacts: {
        email: string,
        mobile: string
    },
}
type Listings = { info: DataFromFakeGenerator, images?: { id: string, url: string, description: string }[], location: LatLngTuple, uuid: string }[]

const generateFakeData = async (loadData: React.Dispatch<React.SetStateAction<Listings>>) => {
    const getRandomInRange = (min: number, max: number): number => {
        return parseFloat(Math.floor(Math.random() * (max - min + 1) + min).toString())
    }
    let compiledData: Listings = [];
    const unsplash = createApi({accessKey: process.env.REACT_APP_FAKE_IMAGE_API_TOKEN as string});

    const data: DataFromFakeGenerator[] = []
    for (let i = 0; i < 10; i++) {
        data.push({
            contacts: {email: randomEmail(), mobile: createMobilePhoneNumber('USA')},
            first_name: fakerator.names.firstName(),
            last_name: fakerator.names.lastName(),
            location: {
                city: fakerator.address.city(),
                country: fakerator.address.country(),
                state: fakerator.address.city(),
                street: fakerator.address.street()
            }
        })
    }
    for (const entry of data) {
        try {
            const result = await unsplash.photos.getRandom({
                query: 'house interior',
                count: 5
            });
            compiledData.push({
                info: {...entry},
                location: [43.000000 + getRandomInRange(602910, 813591) / 1000000, -79.000000 - getRandomInRange(727310, 786340) / 1000000],
                uuid: uuid(),
                images:
                    (result.response as
                        {
                            id: string,
                            description: string,
                            urls: { full: string }
                        }[]).map(
                        image => ({
                            id: image.id,
                            url: image.urls.full,
                            description: image.description
                        }))
            })
        } catch (e) {
            compiledData.push({
                info: {...entry},
                location: [43.000000 + getRandomInRange(602910, 813591) / 1000000, -79.000000 - getRandomInRange(727310, 786340) / 1000000],
                uuid: uuid()
            })
        }
    }
    loadData(compiledData)
}

function Home() {
    const [listings, setListings] = useState<Listings>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        generateFakeData(setListings).then(() => {
            setLoading(false)
        })
    }, []);
    //813591,727310
    //602910,786340

    return (
        <div style={{
            "display": 'flex',
            'justifyContent': 'center',
            'alignItems': 'center',
            'height': 'calc(100vh - 80px)',
            'width': '100vw',
            backgroundImage: "url('https://images.unsplash.com/photo-1524813686514-a57563d77965?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }}>
            {
                loading ?
                    <Loading/>
                    :
                    <Container id={'mainContainer'}>
                        <MapContainer center={[43.73, -79.76] as LatLngTuple} zoom={12} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {listings.map((listing) => {
                                    const {info, images, location, uuid} = {...listing}
                                    return (
                                        <Marker key={uuid} position={location}>
                                            <Popup>
                                                <Card style={{width: '18rem'}} className="text-center">
                                                    <Carousel>
                                                        {
                                                            images
                                                            &&
                                                            images.map(image => (
                                                                <Carousel.Item key={image.id}>
                                                                    <img
                                                                        className="d-block w-100"
                                                                        src={image.url}
                                                                        alt="imageName"
                                                                        style={{
                                                                            height: "300px",
                                                                            objectFit: 'cover'
                                                                        }}
                                                                    />
                                                                    <Carousel.Caption>
                                                                        {/*<h3>Image Location Name</h3>*/}
                                                                        <p>{image.description}</p>
                                                                    </Carousel.Caption>
                                                                </Carousel.Item>
                                                            ))

                                                        }
                                                    </Carousel>
                                                    <Card.Body>
                                                        <Card.Title>
                                                            {`${info.location.street}, ${info.location.city}`}
                                                        </Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">
                                                            {`${info.first_name} ${info.last_name}`}
                                                        </Card.Subtitle>
                                                        <ListGroup className="list-group-flush">
                                                            <ListGroup.Item>
                                                                <Card.Text>
                                                                    House Description goes here
                                                                </Card.Text>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Card.Text>
                                                                    $69.69
                                                                </Card.Text>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item className="text-start">
                                                                <Container>
                                                                    <Row className="justify-content-md-center">
                                                                        <Col sm={1}>
                                                                            <ImMail4/>
                                                                        </Col>
                                                                        <Col sm={10}>
                                                                            <Card.Link href={"mailto:" + info.contacts.email}>
                                                                                {info.contacts.email}
                                                                            </Card.Link>
                                                                        </Col>
                                                                    </Row>
                                                                </Container>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item className="text-start">
                                                                <Container>
                                                                    <Row className="justify-content-md-center">
                                                                        <Col sm={1}>
                                                                            <BsFillTelephoneFill/>
                                                                        </Col>
                                                                        <Col sm={10}>
                                                                            <Card.Link href={"tel:" + info.contacts.mobile}>
                                                                                {info.contacts.mobile}
                                                                            </Card.Link>
                                                                        </Col>
                                                                    </Row>
                                                                </Container>
                                                            </ListGroup.Item>
                                                        </ListGroup>
                                                    </Card.Body>
                                                </Card>
                                            </Popup>
                                        </Marker>)
                                }
                            )}
                        </MapContainer>
                    </Container>
            }
        </div>


    );
}

export default Home;
