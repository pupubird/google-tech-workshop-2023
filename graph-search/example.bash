curl -X GET \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    "https://enterpriseknowledgegraph.googleapis.com/v1/projects/PROJECT_ID/locations/LOCATION/publicKnowledgeGraphEntities:Search?query=SEARCH_QUERY&limit=LIMIT"