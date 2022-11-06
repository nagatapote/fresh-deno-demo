import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

import dayjs from "https://esm.sh/dayjs@1.11.6";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
dayjs.extend(relativeTime);
dayjs.locale("ja");

interface Article {
  id: string;
  title: string;
  created_at: string;
}

export const handler: Handlers<Article[]> = {
  GET(_, ctx) {
    const articles: Article[] = [
      {
        id: "1",
        title: "Article 1",
        created_at: "2022-06-17T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Article 2",
        created_at: "2022-06-10T00:00:00.000Z",
      },
    ];
    return ctx.render(articles);
  },
};

export default function Home({ data }: PageProps<Article[]>) {
  return (
    <div class="h-screen bg-gray-200">
      <Head>
        <title>Fresh Blog</title>
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col">
        <h1 class="font-extrabold text-5xl text-gray-800">Fresh Blog</h1>
        <section class="mt-8">
          <h2 class="text-4xl font-bold text-gray-800 py-4">Posts</h2>
          <ul>
            {data.map((article) => (
              <li
                class="bg-white p-6 rounded-lg shadow-lg mb-4"
                key={article.id}
              >
                <a href={`articles/${article.id}`}>
                  <h3 class="text-2xl font-bold mb-2 text-gray-800 hover:text-gray-600 hover:text-underline">
                    {article.title}
                  </h3>
                </a>
                <time
                  class="text-gray-500 text-sm"
                  dateTime={article.created_at}
                >
                  {dayjs(article.created_at).fromNow()}
                </time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
