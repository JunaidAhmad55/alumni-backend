function formatDoc(doc) {
  const obj = doc.toObject();
  const { _id, ...rest } = obj;
  return { id: _id.toString(), ...rest };
}

function formatDocs(docs) {
  return docs.map(formatDoc);
}

module.exports = { formatDoc, formatDocs };
