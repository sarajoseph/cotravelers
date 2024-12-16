import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type TextEditorProps = {
  placeholder: string
  value: string
  onChange: (content: string) => void
}

export const TextEditor = ({ placeholder, value, onChange }: TextEditorProps) => {
  return (
    <ReactQuill
      theme='snow'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}