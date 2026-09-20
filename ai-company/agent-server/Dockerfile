# Dhis (laga bilaabo folder-ka ai-company):
#   docker build -f agent-server/Dockerfile -t fcs-agents .
# Orod (data waa in loo dhigaa volume, haddii kale dib u bilaabista ayay lumaysaa):
#   docker run -p 8787:8787 --env-file agent-server/.env -v fcs-data:/data fcs-agents
FROM node:22-alpine
WORKDIR /app
COPY agent-server/package.json ./agent-server/package.json
COPY agent-server/src ./agent-server/src
COPY FCS-AI-Company.md ./FCS-AI-Company.md
COPY knowledge ./knowledge
ENV NODE_ENV=production DATA_DIR=/data BRAIN_FILE=/app/FCS-AI-Company.md PORT=8787
VOLUME /data
EXPOSE 8787
USER node
CMD ["node", "agent-server/src/server.js"]
