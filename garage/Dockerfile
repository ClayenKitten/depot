FROM alpine:3.20

COPY --from=dxflrs/garage:v1.0.0 /garage /bin/garage
COPY --from=ghcr.io/tarampampam/curl:8.6.0 /bin/curl /bin/curl

HEALTHCHECK \
    --interval=5s \
    --timeout=5s \
    --retries=2 \
    --start-period=5s \
    CMD "curl --fail http://localhost:3903/health || exit 1

CMD [ "garage", "server"]
