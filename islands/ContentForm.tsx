import { useState } from "preact/hooks";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Props {
  initialValue?: string;
}

export default function ContentForm({ initialValue = "" }: Props) {
  // コンテンツの入力値を保持する
  const [value, setValue] = useState(initialValue);
  // プレビュー表示するかどうかの状態
  const [preview, setPreview] = useState(false);

  /**
   * マークダウンをパースする関数
   */

  const parse = (content: string) => {
    const parsed = marked(content);
    const purified = DOMPurify.sanitize(parsed);
    return purified;
  };

  const handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setValue(target.value);
  };

  return (
    <div>
      <div class="flex justify-between">
        <label class="text-gray-500 text-sm" htmlFor="content">
          Content
        </label>
        <label class="text-gray-500 text-sm">
          Preview
          <input
            type="checkbox"
            id="preview"
            class="ml-2"
            checked={preview}
            onChange={() => setPreview((prev: boolean) => !prev)}
          />
        </label>
      </div>
      {/** previewがtrueの場合、パース済のコンテンツを表示 */}
      {/** それ以外の場合にはコンテンツの入力フォームを表示 */}
      {preview
        ? (
          <div
            id="content"
            dangerouslySetInnerHTML={{
              __html: parse(value),
            }}
          >
          </div>
        )
        : (
          <textarea
            id="content"
            rows={10}
            class="w-full p-2 border border-gray-300 rounded-md"
            name="content"
            value={value}
            onChange={handleChange}
          >
          </textarea>
        )}
    </div>
  );
}
