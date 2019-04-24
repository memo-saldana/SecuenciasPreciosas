module.exports = (mongoose) =>{
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

  mongoose.connection.on('error', error => console.log(`Connection to ${ process.env.PROJECT_NAME } database failed: ${error}`));
  mongoose.connection.on('connected', () => console.log(`Connected to ${ process.env.PROJECT_NAME } database`));
  mongoose.connection.on('disconnected', () => console.log(`Disconnected from ${ process.env.PROJECT_NAME } database`));

}

