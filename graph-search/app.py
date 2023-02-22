from typing import Sequence
from google.cloud import enterpriseknowledgegraph as ekg

# TODO(developer): Uncomment these variables before running the sample.
project_id = 'bright-anagram-378309'
location = 'global'      # Values: 'global'
search_query = input("Your search query")
languages = ['en']                    # Optional: List of ISO 639-1 Codes
# Optional: List of schema.org types to return
types = ['']
limit = 20                            # Optional: Number of entities to return


def search_public_kg_sample(
    project_id: str,
    location: str,
    search_query: str,
    languages: Sequence[str] = None,
    types: Sequence[str] = None,
    limit: int = 20,
):
    # Create a client
    client = ekg.EnterpriseKnowledgeGraphServiceClient.from_service_account_file(
        './credentials.json'
    )

    # The full resource name of the location
    # e.g. projects/{project_id}/locations/{location}
    parent = client.common_location_path(project=project_id, location=location)

    # Initialize request argument(s)
    request = ekg.SearchPublicKgRequest(
        parent=parent,
        query=search_query,
        languages=languages,
        types=types,
        limit=limit,
    )

    # Make the request
    response = client.search_public_kg(request=request)

    print(f"Search Query: {search_query}\n")

    # Extract and print date from response
    for item in response.item_list_element:
        result = item.get("result")

        print(f"Name: {result.get('name')}")
        print(f"- Description: {result.get('description')}")
        print(f"- Types: {result.get('@type')}\n")

        detailed_description = result.get("detailedDescription")

        if detailed_description:
            print("- Detailed Description:")
            print(
                f"\t- Article Body: {detailed_description.get('articleBody')}")
            print(f"\t- URL: {detailed_description.get('url')}")
            print(f"\t- License: {detailed_description.get('license')}\n")

        print(f"- Cloud MID: {result.get('@id')}")
        for identifier in result.get("identifier"):
            print(f"\t- {identifier.get('name')}: {identifier.get('value')}")

        print("\n")
