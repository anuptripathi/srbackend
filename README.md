NestJs NextJs Skaffold Setup Steps

Copy from Windows folder (mnt => mount) to WSL (windows sub system folder)
cp -r /mnt/c/Users\Anup\Downloads\permissions /code/siterel/srbackend/apps/srmain/src/
cp -r /mnt/c/Users\Anup\Downloads\roles_module /code/siterel/srbackend/apps/srmain/src/roles

git config --global user.email "youremail like anup.giit@gmail.com"
git config --global user.name "your username like anuptripathi"

sudo apt-get remove nodejs
sudo apt-get remove npm

sudo apt remove --purge libnode-dev
sudo apt remove --purge nodejs
sudo apt autoremove
sudo apt clean
sudo apt update
#install specific version, eg 18 in following example.
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v

k8s/sleepr#
helm install sleepr .
helm upgrade sleepr .
helm uninstall sleepr
kubectl describe pod auth-8467ffc8fc-blf4r

kubectl get po (or pod)
kubectl get svc (or service)
kubectl logs pod-id --follow (optinally), --previous (if failed after running once)

kubectl rollout restart deployment notifications (after fixing the image.)

mongodb cloud
username: localhostuser
password: o0JP5V3434jkPveAPyXz9ndjljlfdfldjfld

mongodb+srv://localhostuser:dfhlkdfldkf@cluster0.wieaize.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

kubectl create secret generic mongodb --from-literal=connectionString=mongodb+srv://localhostuser:dfkdhfjkdhfkjd@cluster0.wieaize.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

kubectl delete secret mongodb
kubectl create secret generic mongodb --from-literal=connectionString=mongodb+srv://localhostuser:93479374@cluster0.wieaize.mongodb.net/siterel?retryWrites=true&w=majority&appName=Cluster0

kubectl create secret generic jwt --from-literal=jwtSecret=4YdOfiPtyv1aYAjSdfdfdfdfdfdfdr7MidPOnmZHtT4AdLAvQldpHvD2SROwEXS7E1JQHhUn0XEy0bOCCHnI8zIxWKocI7ASb7Kh3uQ0spn9FsZ

kubectl create secret generic stripe --from-literal=apiKey=sk_test_UGgMKAi7vjrbJ2xkFI7dfjkdljfldjkfjldjfl dljfX0IHnbznu6SiEKjkYzSga9NTxSTuS5GdRNCXxkjqsFVJSIEJIwFfyRrRLe00JL5ExNPw

or kubectl create secret generic auth-secrets --from-env-file=.env

kubectl delete secret <secret-name>
kubectl delete secret mongodb
kubectl delete secret jwt
kubectl delete secret stripe

kubectl get secret mongodb -o yaml

kubectl create service clusterip auth --tcp=3001,3002 --dry-run=client -o yaml > service.yaml
kubectl create deployment auth --dry-run=cient -o yaml> deployment.yaml ~~

helm list

#grpc work, ts-proto and protoc helps to create type definitions against each proto files
pnpm add -D ts-proto
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./libs/common/src/types/ --ts_proto_opt=nestJs=true ./proto/notifications.proto

protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./libs/common/src/types/ --ts_proto_opt=nestJs=true ./proto/auth.proto

kubectl get services
You should see something like:
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
auth ClusterIP 10.96.150.10 <none> 5001/TCP 16m
reservations ClusterIP 10.96.150.11 <none> 5002/TCP

npx prisma migrate dev --name name_the_change

or
npx prisma migrate dev --create-only --name name_the_change
npx prisma migrate dev

# only create schema and then check manually in created migration file and then run by above command again.

#This command will sync the Prisma schema with your database without altering the existing data. you can manually change db and then take pull.
npx prisma db pull # to update your prisma schema
npx prisma generate # to generate the prisam client data types
npx prisma migrate resolve --applied 20241006173655_add_timestamps_to_user
npx prisma migrate resolve --applied "20241011111515_roles_permissions_tabl"

skaffold dev
skaffold fix
skaffold delete
skaffold run --tail# to just run, no file change lookup.
#all above with optional file name: eg, skaffold dev -f skaffold-prod.yaml

save without prettier or formatting on vs code ctr+k and then ctr+shift+s

{
"name": "Admin Role",
"description": "This role grants admin level permissions.",
"permissions": [
{
"title": "Manage Users",
"subject": "users",
"actions": ["add", "edit", "delete", "read"]
},
{
"title": "Manage Roles",
"subject": "roles",
"actions": ["add", "edit", "delete", "read"]
},
{
"title": "Manage Products",
"subject": "products",
"actions": ["add", "edit", "delete", "read"]
}
]
}
