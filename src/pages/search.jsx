import Axios from "axios";

import Layout from "components/Layout";
import { apiLinks } from "../../site.config";
import Invitation from "components/common/Invitation";
import Header from "components/search/Header";
import { Component } from "react";
import { Col, Container, Row, Spinner } from "reactstrap";
import { getItems, getShortLink } from "utils/courses";
import Results from "components/search/Results";

export default class Courses extends Component {
  constructor() {
    super();
    this.state = {
      query: {
        word: "",
        results: null,
      },
    };
  }

  calculateScore = (string, word, level) => {
    if (!string) {
      return 0;
    } else {
      return string.includes(word) ? 1 : 0;
    }
  };

  initSearch = (pack, word) => {
    this.setState({ results: null });

    var scores = [];

    for (let i = 0; i < pack.length; i++) {
      const strings = pack[i].strings;
      let score = 0;

      for (let j = 0; j < strings.length; j++) {
        const string = strings[j];
        score = score + this.calculateScore(string, word, j);
      }

      scores[i] = score;
    }

    let results = [];

    for (let i = 0; i < pack.length; i++) {
      if (scores[i]) {
        results.push({
          score: scores[i],
          ...pack[i],
        });
      }
    }

    this.setState({ results });
  };

  componentDidMount() {
    const word = new URL(document.location).searchParams.get("word");
    this.initSearch(this.props.pack, word);
    this.setState({ word: word });
  }

  componentDidUpdate() {
    const word = new URL(document.location).searchParams.get("word");

    if (this.state.word !== word) {
      this.initSearch(this.props.pack, word);
      this.setState({ word: word });
    }
  }

  // const { query } = useRouter();
  render() {
    return (
      <Layout title="All Courses">
        <Header word={this.state.word} />
        <Container>
          <Row>
            <Col lg="9">
              {this.state.results ? (
                <Results results={this.state.results} />
              ) : (
                <Spinner />
              )}
            </Col>
            <Col lg="3"></Col>
          </Row>
        </Container>
        <Invitation />
      </Layout>
    );
  }
}
export async function getStaticProps() {
  const response = await Axios({
    method: "get",
    url: apiLinks.getAllCourses,
  });
  const { courses } = response.data;

  //packing courses
  const coursesPack = courses.map((course) => ({
    strings: [
      course.course_title.toLowerCase(),
      course.course_description.toLowerCase(),
      course.course_long_description.toLowerCase(),
    ],
    type: "course",
    link: "/" + course.course_short_link,
    course,
  }));

  //packing items
  let itemsPack = [];

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const items = await getItems(course);
    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      itemsPack.push({
        strings: [item.item_title.toLowerCase(), item.item_description || null],
        type: "item",
        link:
          "/" + course.course_short_link + "/" + getShortLink(item.item_title),
        item,
      });
    }
  }

  return {
    props: {
      pack: [...coursesPack, ...itemsPack],
    },
  };
}
