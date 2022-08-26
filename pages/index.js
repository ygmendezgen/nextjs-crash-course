import { Fragment, useContext } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
const DUMMY_MEEups = [
  {
    id: "m1",
    title: "a first meetup",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm2EtZpJNgbWBqHI77fbIxVw9zKm5Hrn9pfg&usqp=CAU",
    address: "some address",
    description: "this is a meetup",
  },
  {
    id: "m2",
    title: "a second meetup",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm2EtZpJNgbWBqHI77fbIxVw9zKm5Hrn9pfg&usqp=CAU",
    address: "some address",
    description: "this is second a meetup",
  },
];
function HomePage(props) {
  // remove data fetching from client to build process side
  return (
    <Fragment>
      <Head>
        <title>React meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly adictive React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// reserved name, runs for every reqquest
// this function will run always on server after deployment
// export async function getServerSideProps() {
//   // If request/res needed
//   // const req = context.req;
//   // const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEEups,
//     },
//   };
// }

// Prepare props for HomePage
// Load data before component function is executed
export async function getStaticProps() {
  // code will never execute on their machines
  const client = await MongoClient.connect(
    "mongodb+srv://admin:admin@cluster0.btz8lty.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  // fetch data form an API
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      })),
    },
    // re-generate on the server on production depending on how much your data changes
    // ensure page is updated after deployment
    revalidate: 10, // generate every 10 seconds if there are requests coming in for this page
  }; // always return {}
}
export default HomePage;
