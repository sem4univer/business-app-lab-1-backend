## Запуск

Предварительно запустить docker-daemon (Docker desktop, colima etc)
```bash
  npm run start:dev
```

Если будет проблема с тем, что каких-то таблиц нет, то
```bash
  # В 1 консоли
  npm run start:dev:database

  # В 2 консоли
  npm run schema:sync

  # Останавливаем start:dev:database в 1 консоли
  ^C

  # Запускаем заново все
  npm run start:dev
```

## Deploy

YC: https://console.cloud.yandex.ru/folders/b1ghqm8tpo0hh2volbsl
Docker registry: https://console.cloud.yandex.ru/folders/b1ghqm8tpo0hh2volbsl/container-registry/registries/crp9pfdb3i7rpr96eklp/overview/lab-1/image
Инструкция по развертыванию https://cloud.yandex.ru/docs/container-registry/tutorials/run-docker-on-vm

TL;DR

```bash
  export PUBLIC_IP=zhaba@51.250.109.119
  export REGISTRY_ID=crp9pfdb3i7rpr96eklp
```

Берем токен [отсюда](https://oauth.yandex.ru/verification_code#access_token=y0_AgAAAAAsT249AATuwQAAAADwtyVfXZ9C0-hxTK6U4_qj_Fvm7cPTjiA&token_type=bearer&expires_in=30017517)

```bash
  echo <oauth-токен> | docker login --username oauth --password-stdin cr.yandex
  # NEW_TAG_NUMBER - новый номер тэга. 
  docker build . -t cr.yandex/${REGISTRY_ID}/lab-1:tag-${NEW_TAG_NUMBER}
  docker push cr.yandex/${REGISTRY_ID}/lab-1:tag-${NEW_TAG_NUMBER} 
```


Далее на VM'ке

```bash
  ssh -i ~/.cloud-ssh/id_ed25519 zhaba@51.250.109.119

  # Страшная команда
  curl -H Metadata-Flavor:Google 169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token | \
  cut -f1 -d',' | \
  cut -f2 -d':' | \
  tr -d '"' | \
  sudo docker login --username iam --password-stdin cr.yandex
  export REGISTRY_ID=crp9pfdb3i7rpr96eklp
  sudo docker pull cr.yandex/${REGISTRY_ID}/lab-1:tag-${NEW_TAG_NUMBER}

  # Остановить активный контейнер
  sudo docker kill ...

  sudo docker run --env-file ./.env -p 80:3000 cr.yandex/${REGISTRY_ID}/lab-1:tag-${NEW_TAG_NUMBER}

  # http://51.250.109.119/api/
```

