import { Head } from "next/document";
import React from "react";

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ</title>
        <meta name="description" content="Rate my app website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto mt-8">
        <h1 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h1>
        <div className="collapse-group">
          <div className="collapse bg-base-200">
            <input type="radio" name="my-accordion-1" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              How do I create an account on Rate My App?
            </div>
            <div className="collapse-content">
              <p>
                To create an account on Rate My App, click on the "Sign Up"
                button and fill in the required information. You can choose to
                sign up using your email address or social media accounts.
              </p>
            </div>
          </div>
          <div className="collapse bg-base-200">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title text-xl font-medium">
              Can I rate an app without leaving a review?
            </div>
            <div className="collapse-content">
              <p>
                Yes, you can rate an app without leaving a review. When rating
                an app, you have the option to provide only a numerical rating
                without any additional comments.
              </p>
            </div>
          </div>
          <div className="collapse bg-base-200">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title text-xl font-medium">
              How can I donate to an app developer?
            </div>
            <div className="collapse-content">
              <p>
                Rate My App provides a donation feature that allows you to
                support app developers financially. When viewing an app's
                details, you'll find a "Donate" button that will guide you
                through the donation process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
