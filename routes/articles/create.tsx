import { Head } from "$fresh/runtime.ts";
import { createArticle } from "@db";
import { Handlers, PageProps } from "$fresh/server.ts";

interface Data {
  /** バリデーションエラー情報 */
  error: {
    title: string;
    content: string;
  };
  /** 前回のタイトルの入力値 */
  title?: string;
  /** 前回のコンテンツの入力値 */
  content?: string;
}

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
    // フォームデータの入力値を取得
    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    // タイトルまたはコンテンツどちらも未入力の場合はバリデーションエラー
    if (!title || !content) {
      return ctx.render({
        error: {
          title: title ? "" : "Title is required",
          content: content ? "" : "Content is required",
        },
        title,
        content,
      });
    }

    const article = {
      title,
      content,
    };

    // データベースに保存
    await createArticle(article);

    // トップページにリダイレクト
    return new Response("", {
      status: 303,
      headers: {
        Location: "/",
      },
    });
  },
};

export default function CreateArticlePage({
  data,
}: PageProps<Data | undefined>) {
  return (
    <div class={"min-h-screen bg-gray-200"}>
      <Head>
        <title>Create Post</title>
      </Head>
      <div
        class={"max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col"}
      >
        <h1 class={"font-extrabold text-5xl text-gray-800"}>Create Post</h1>

        <form
          class={"rounded-xl border p-5 shadow-md bg-white mt-8"}
          method="POST"
        >
          <div class={"flex flex-col gap-y-2"}>
            <div>
              <label class={"text-gray-500 text-sm"} htmlFor="title">
                Title
              </label>
              <input
                id="title"
                class={"w-full p-2 border border-gray-300 rounded-md"}
                type="text"
                name="title"
                value={data?.title} // 前回の入力値を初期値に渡す
              />
              {/* タイトルの入力にバリデーションエラーがあった場合表示する  */}
              {data?.error?.title && (
                <p class={"text-red-500 text-sm"}>{data.error.title}</p>
              )}
            </div>
            <div>
              <label class={"text-gray-500 text-sm"} htmlFor="content">
                Content
              </label>
              <textarea
                id="content"
                rows={10}
                class={"w-full p-2 border border-gray-300 rounded-md"}
                name="content"
                value={data?.content} // 前回の入力値を初期値に渡す
              />
              {/* コンテンツの入力にバリデーションエラーがあった場合表示する */}
              {data?.error?.content && (
                <p class={"text-red-500 text-sm"}>{data.error.content}</p>
              )}
            </div>
          </div>
          <div class={"flex justify-end mt-4"}>
            <button
              class={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"}
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
