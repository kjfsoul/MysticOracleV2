# scripts/match_interpretations.py

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json

# Load data
card_embeddings_df = pd.read_json('../data/card_embeddings.json')
cluster_assignments_df = pd.read_json('../data/cluster_assignments.json')

# Extract embeddings and cluster IDs
card_embeddings = np.array(card_embeddings_df['embedding'].tolist())
card_names = card_embeddings_df['name'].tolist()
card_interpretations = card_embeddings_df['interpretation'].tolist()

user_embeddings = np.array(cluster_assignments_df['embedding'].tolist())
user_ids = cluster_assignments_df['user_id'].tolist()
user_clusters = cluster_assignments_df['cluster_id'].tolist()

# Calculate cluster centroids (simple mean for now)
cluster_centroids = {}
for cluster_id in np.unique(user_clusters):
    cluster_embeddings = user_embeddings[np.array(user_clusters) == cluster_id]
    cluster_centroids[cluster_id] = np.mean(cluster_embeddings, axis=0)

# Match each cluster centroid to the most similar card interpretations
cluster_card_matches = {}
for cluster_id, centroid in cluster_centroids.items():
    similarities = cosine_similarity([centroid], card_embeddings)[0]
    # Get top N most similar cards
    top_n_indices = np.argsort(similarities)[::-1][:5] # Get top 5
    cluster_card_matches[cluster_id] = [
        {"card_name": card_names[i], "similarity": similarities[i], "interpretation": card_interpretations[i]}
        for i in top_n_indices
    ]

# Save the matching results
with open('../data/cluster_card_matches.json', 'w') as f:
    json.dump(cluster_card_matches, f, indent=2)

print("✅ Cluster to card matching complete and saved.")
