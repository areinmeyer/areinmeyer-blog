import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Home
      </h1>
      <p className="mb-4">
        {`Hi! I'm a Senior Software Engineer who lives in Perrysburg, OH.
        I have over 20 years in the software development industry.  I have written code in Excel, FoxPro and Perl.
        Nowadays I work on scaleable APIs and other platform applications using React, Node.js, and AWS.  
        `}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
