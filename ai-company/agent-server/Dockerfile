# Dhis (laga bilaabo folder-ka ai-company):
#   docker build -f agent-server/Dockerfile -t fcs-agents .
# Orod: DATA_DIR default-kiisu waa /tmp/data (aan u baahnayn disk gaar ah, wuu shaqeeyaa host bilaash ah oo kale).
# Haddii aad disk joogto ah (persistent) heysato oo aad rabto in xogtu sii jirto dib-u-bilaabid kasta kadib,
# ku dar DATA_DIR=/data oo isku xidh disk-kaaga halkaas (ha isku halayn USER node inuu isagu isaga qoro/leeyahay).
FROM node:22-alpine
WORKDIR /app
COPY agent-server/package.json ./agent-server/package.json
COPY agent-server/src ./agent-server/src
COPY FCS-AI-Company.md ./FCS-AI-Company.md
COPY knowledge ./knowledge
ENV NODE_ENV=production DATA_DIR=/tmp/data BRAIN_FILE=/app/FCS-AI-Company.md PORT=8787
EXPOSE 8787
USER node
CMD ["node", "agent-server/src/server.js"]
