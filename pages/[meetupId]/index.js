import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment, useContext } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";
function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        description={props.meetupData.description}
        address={props.meetupData.address}
      ></MeetupDetail>
    </Fragment>
  );
}

// return all dynamic values for which this should be generated
// tell for which dynamic values this page should be re-generated
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:admin@cluster0.btz8lty.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetupIds = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();
  return {
    // fallback: false: path containes all supported id values (if m3, 404 error will be shown)
    // fallback" true: you didn't define all the supported paths
    fallback: false,
    paths: meetupIds.map((meetups) => ({
      params: {
        meetupId: meetups._id.toString(),
      },
    })),
  };
}

// Page is pre-generated during build process
// Next js needs to pre-generate all version of all of these version for this path
export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://admin:admin@cluster0.btz8lty.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetupObj = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  // fetch data for a single meetup
  return {
    props: {
      meetupData: {
        id: meetupObj._id.toString(),
        title: meetupObj.title,
        image: meetupObj.image,
        description: meetupObj.description,
        address: meetupObj.address,
      },
    },
  };
}

export default MeetupDetails;
