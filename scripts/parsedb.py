import json
import re

new_docs = []

staff_regex = r'^.*@mq.edu.au$'

with open('file', 'r') as f:
    lines = f.readlines()

    for line in lines:
        doc = json.loads(line)

        try:
            doc["attempts"]
            doc["status"]
        except:
            continue

        if len(doc["attempts"]) == 0:
            continue

        email = doc["attempts"][-1]["email"]

        new_doc = {
                "_id": doc["_id"],
                "discordId": doc["user_id"],
                "verified": doc["status"] == "verified",
                "email": email,
                "isStaff": len(re.findall(staff_regex, email)) == 1,
                "attempts": [],
                }

        new_docs.append(new_doc)

with open('out', 'w') as f:
    for doc in new_docs:
        f.write(json.dumps(doc).replace(' ', '') + '\n')

