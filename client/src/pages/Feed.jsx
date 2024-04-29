import { useState } from "react";

import FeedItem from "../components/FeedItem";
import { searchOpenLibrary } from "../../utils/API";

const Feed = () => {
    const [feed, setFeed] = useState([]);

    // return an array of books based on a query and optional queryType
    const getBookData = async (query, queryType = "q") => {
        try {
            // query OpenLibrary, receiving a response
            const response = await searchOpenLibrary(query, queryType);
            
            // if the response was not ok, throw an error
            if (!response.ok) {
                throw new Error("error fetching books");
            }
            
            // parse the response as json
            const { docs } = await response.json();

            // save the relevant parts of the response
            const bookData = docs.map((book) => ({
                authors: book.author_name,
                title: book.title,
                cover: `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`,
                bookId: book.key,
                firstSentence: book.first_sentence,
                link: `https://openlibrary.org${book.seed[0]}`
            }));

            // return the book data from the query
            // console.log(bookData);
            return bookData;
        } catch (error) {
            console.error(error);
        }
    }

    // return partial feeds
    const getPartialFeeds = async () => {
        const preferences = {
            authors: ["Umberto Eco", "Ursula K. Le Guin", "Walter Rodney"],
            subjects: ["horror", "sci-fi", "fantasy"]
        }

        const sortedPreferences = [];
        Object.keys(preferences).forEach((key) => {
            preferences[key].forEach((value) => {
                sortedPreferences.push({queryType: key.slice(0, key.length - 1), query: value});
            })
        });

        const partialFeeds = [];
        for (let i = 0; i < sortedPreferences.length; i++) {
            let preference = sortedPreferences[i];
            const data = await getBookData(preference.query, preference.queryType);
            setTimeout(() => partialFeeds.push(data), i * 1000);
        }

        // console.log(partialFeeds);
        return partialFeeds;
    }

    // return complete feed
    const getFeed = async () => {
        const partialFeeds = await getPartialFeeds();

        console.log(partialFeeds);

        const maxLength = partialFeeds.reduce((acc, cur) => acc > cur.length ? acc : cur.length, 0) * partialFeeds.length;

        const result = [];

        for (let i = 0; i < maxLength * partialFeeds.length; i++) {
            const feedNumber = i % partialFeeds.length;
            const feedIndex = Math.floor(i / partialFeeds.length);
            if (feedIndex < partialFeeds[feedNumber].length) {
                result.push(partialFeeds[feedNumber][feedIndex]);
            }
        }

        // console.log(result);
        setFeed(result);
    }

    // getFeed();

    return (
        <FeedItem feedItem={{authors: "Tolkien", title: "LOTR"}}></FeedItem>
    );
}

export default Feed;
