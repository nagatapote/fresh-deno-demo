import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Article, findArticleById } from "@db";
import dayjs from "dayjs";
import { marked } from "marked";
import sanitize from "sanitize-html";

interface Data {
  /** DB から取得した記事 */
  article: Article;
  /** パース済みのコンテンツ */
  parsedContent: string;
}

export const handler: Handlers<Data | null> = {
  async GET(_, ctx) {
    // パスパラメータを取得
    const { id } = ctx.params;
    //  パスパラメータの ID を引数に記事を取得
    const article = await findArticleById(id);

    // 記事が取得できなかった場合は null を渡す
    if (!article) {
      return ctx.render(null);
    }

    // マークダウンをパースする
    const parsed = marked(article.content);
    // HTML をサニタイズする
    const parsedContent = sanitize(parsed);

    // 記事が取得できた場合は取得した記事を渡す
    return ctx.render({
      article,
      parsedContent,
    });
  },
};

export default function ArticlePage({ data }: PageProps<Data | null>) {
  // Props.dataに null が渡された時には `Not Found` を表示する
  if (!data) {
    return <div>Not Found</div>;
  }

  const { article, parsedContent } = data;

  return (
    <div class="min-h-screen bg-gray-200">
      <Head>
        <title>{article.title}</title>
        <link rel="stylesheet" href="/article.css" />
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col">
        <article class="rounded-xl border p-5 shadow-md bg-white">
          <header>
            <h1 class="font-extrabold text-5xl text-gray-800">
              {article.title}
            </h1>
            <time class="text-gray-500 text-sm" dateTime={article.created_at}>
              {dayjs(article.created_at).format("YYYY-MM-DD HH:mm:ss")}
            </time>
          </header>
          <section class="mt-6">
            <div
              id="contents"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          </section>
        </article>
      </div>
    </div>
  );
}
