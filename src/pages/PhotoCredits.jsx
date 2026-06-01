import { photoCredits } from "../data/photoCreditsdata";

export default function PhotoCredits() {
  return (
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Photo credits
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Image and photography credits
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            BHCA is grateful to the photographers, volunteers and community
            members whose images help tell the story of Beeston Hill.
          </p>
        </div>
      </section>

      <section className="bg-[#faf8ff] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6">
            {photoCredits.map((credit) => (
              <article
                key={credit.id}
                className="rounded-3xl bg-white p-8 shadow-sm"
              >
                <h2 className="mb-3 text-2xl font-black text-[#171717]">
                  {credit.title}
                </h2>

                <div className="grid gap-3 text-gray-600">
                  <p>
                    <strong className="text-[#171717]">Photographer:</strong>{" "}
                    {credit.photographer}
                  </p>

                  <p>
                    <strong className="text-[#171717]">Year:</strong>{" "}
                    {credit.year}
                  </p>

                  <p>
                    <strong className="text-[#171717]">Used on:</strong>{" "}
                    {credit.usage}
                  </p>

                  <p>
                    <strong className="text-[#171717]">Licence:</strong>{" "}
                    {credit.licenseUrl ? (
                      <a
                        href={credit.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#5e17eb] hover:text-[#ff914d]"
                      >
                        {credit.license}
                      </a>
                    ) : (
                      credit.license
                    )}
                  </p>

                  {credit.sourceUrl && (
                    <p>
                      <strong className="text-[#171717]">Source:</strong>{" "}
                      <a
                        href={credit.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#5e17eb] hover:text-[#ff914d]"
                      >
                        View original image
                      </a>
                    </p>
                  )}

                  <p>
                    <strong className="text-[#171717]">
                      Changes made:
                    </strong>{" "}
                    {credit.changesMade ? "Yes" : "No"}
                  </p>

                  {credit.changesMade && credit.changesDescription && (
                    <p>
                      <strong className="text-[#171717]">
                        Change details:
                      </strong>{" "}
                      {credit.changesDescription}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm">
  <h2 className="mb-4 text-2xl font-black text-[#171717]">
    Copyright Notice
  </h2>

  <p className="mb-4 text-gray-600 leading-relaxed">
    Unless otherwise stated, photographs, images and content on this website
    are owned by Beeston Hill Community Association or are used with
    permission.
  </p>

  <p className="mb-4 text-gray-600 leading-relaxed">
    Images and content may not be reproduced, copied, distributed or used
    without prior written permission from BHCA.
  </p>

  <p className="text-gray-600 leading-relaxed">
    Third-party images remain subject to their original licence terms and are
    credited above where required.
  </p>
</div>

          <div className="mt-12 rounded-3xl bg-white p-8 text-gray-600 shadow-sm">
            <p>
              If you believe an image has been credited incorrectly, or you
              would like an image removed, please contact us at{" "}
              <a
                href="mailto:contact@beestonhill.org.uk"
                className="font-bold text-[#5e17eb] hover:text-[#ff914d]"
              >
                contact@beestonhill.org.uk
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}