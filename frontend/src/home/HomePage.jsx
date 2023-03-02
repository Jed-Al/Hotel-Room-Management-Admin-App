import { Link } from "react-router-dom";
import { Button, ButtonGroup } from "reactstrap";
import "./HomePage.css";

export default function HomePage() {
    return (
        <div className="homepage">
            <h1>Admin Panel</h1>
            <div className="homepage-buttons">
                <ButtonGroup>
                    <Link to="/booking">
                        <Button className="home-button">Book a Room</Button>
                    </Link>
                    <Link to="/manage">
                        <Button className="home-button">Manage Booking</Button>
                    </Link>
                </ButtonGroup>
            </div>
        </div>
    )
}