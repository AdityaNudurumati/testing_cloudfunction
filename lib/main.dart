import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Firebase Data'),
        ),
        body: EntryListWidget(),
      ),
    );
  }
}

class EntryListWidget extends StatelessWidget {
  final CollectionReference entriesCollection =
      FirebaseFirestore.instance.collection('entriesa');

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: entriesCollection.snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          final data = snapshot.data;
          final entries = data!.docs;

          return ListView.builder(
            itemCount: entries.length,
            itemBuilder: (context, index) {
              final entry = entries[index].data() as Map<String, dynamic>;
              return Card(
                margin: EdgeInsets.all(8.0),
                child: ListTile(
                  title: Text(entry['title']??""),
                  subtitle: Text(entry['text']??""),
                ),
              );
            },
          );
        }
      },
    );
  }
}
