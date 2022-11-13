import React, { useEffect, useState } from "react";
import Layout from "../Layout/Admin/Layout.Component";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Loader from "../Loader/Loader.component";

export default function Create() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [particulars, setParticulars] = useState("");
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);
  const [button_text, setButtonText] = useState("Create");
  const [card_header, setCardHeader] = useState("Create Particulars");
  const [card_title, setCardTitle] = useState("Fill the Form");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (typeof id !== "undefined") {
      setLoading(true);
      show();
      setButtonText("Save");
      setCardHeader("Update Particulars Information");
      setCardTitle("Particulars Information");
    }
  }, []);

  const show = async () => {
    await axios
    .get(`${process.env.REACT_APP_API_BASE_URL}particulars/${id}`, { headers: { Authorization: `Bearer ${token}` }})
    .then(({data})=>{
      const { particulars } = data.Particulars
      setParticulars(particulars);
    }).catch(({response})=>{
      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
        });
      }
    })
    setLoading(false);
  };

  const create = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("particulars", particulars);
    const token = localStorage.getItem("authToken");
    var api = ``;
    if (id) {
      api = `${process.env.REACT_APP_API_BASE_URL}particulars/${id}/edit`;
    } else {
      api = `${process.env.REACT_APP_API_BASE_URL}particulars`;
    }

    await axios
      .post(api, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        }).then(function() {
          navigate("/particulars");
        });
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.status === 422) {
          setValidationError(response.data.errors);
        } else if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        <Layout>
          <Container>
            <Row className="justify-content-md-center">
              <Col md={6}>
                <Card>
                  <Card.Header>{card_header}</Card.Header>
                  <Card.Body>
                    <Card.Title>{card_title}</Card.Title>
                    <Form onSubmit={create}>
                      <Row>
                        <Col>
                          <Form.Group controlId="particulars">
                            <Form.Label>Particulars</Form.Label>
                            <Form.Control
                              type="text"
                              value={particulars}
                              onChange={(event) => {
                                setParticulars(event.target.value);
                              }}
                            />
                          </Form.Group>
                          {typeof validationError.particulars !== "undefined" &&
                          validationError.particulars !== "" ? (
                            <Row>
                              <Col>
                                <Alert variant="danger p-2">
                                  {validationError.particulars}
                                </Alert>
                              </Col>
                            </Row>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={10}>
                          <Button
                            variant="primary"
                            className="mt-2"
                            size="lg"
                            block="block"
                            type="submit"
                          >
                            {button_text}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Layout>
      )}
    </Container>
  );
}