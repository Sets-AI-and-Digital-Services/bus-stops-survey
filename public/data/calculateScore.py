# import json

# # Load the JSON file
# file_path = "/mnt/data/stations.json"
# with open(file_path, "r", encoding="utf-8") as f:
#     stations = json.load(f)

# # Define mapping of scores
# score_map = {
#     "Unacceptable / غير مقبول": 1,
#     "Poor / ضعيف": 2,
#     "Good / جيد": 3,
#     "Very Good / جيد جدًا": 4,
#     "Available / متاح": 3,
#     "Not available / غير متاح": 2,
# }

# # Reverse map for scores
# reverse_map = {
#     1: "Unacceptable / غير مقبول",
#     2: "Poor / ضعيف",
#     3: "Good / جيد",
#     4: "Very Good / جيد جدًا",
# }

# # Function to calculate average score
# def calculate_average(evals):
#     scores = []
#     for v in evals.values():
#         if v in score_map:
#             scores.append(score_map[v])
#     if not scores:
#         return None
#     avg = round(sum(scores) / len(scores))
#     return reverse_map.get(avg, None)

# # Add average_score to evaluations
# for station in stations:
#     evals = station.get("evaluations", {})
#     avg_score = calculate_average(evals)
#     if avg_score:
#         evals["average_score"] = avg_score

# # Save updated file
# output_path = "/mnt/data/stations_with_average.json"
# with open(output_path, "w", encoding="utf-8") as f:
#     json.dump(stations, f, ensure_ascii=False, indent=2)

# output_path
