export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Yuganta AI",
        "url": "https://yuganthaai.com",
        "logo": "https://yuganthaai.com/yugantha-logo.png",
        "sameAs": [
            "https://www.linkedin.com/company/yuganthaai",
            "https://twitter.com/yuganthaai",
            "https://www.instagram.com/yuganthaai"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-8978946421",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": "en"
        }
    };

    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Yuganta AI",
        "url": "https://yuganthaai.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://yuganthaai.com/courses?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify([structuredData, websiteData]),
            }}
        />
    );
}
