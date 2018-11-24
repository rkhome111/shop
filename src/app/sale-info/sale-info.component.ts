import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { saveAs } from 'file-saver';


export interface UserElement {
  id: Number;
  cashMemoNo: string;
  ebNo: string;
  houseNo: string;
  cardHolderName: string;
  aadharNo: Number;
  wheat: string;
  rice: string;
  kerosene: string;
  price: Number;
  billMonth: string;
  edit: boolean;
}

@Component({
  selector: 'app-sale-info',
  templateUrl: './sale-info.component.html',
  styleUrls: ['./sale-info.component.scss']
})

export class SaleInfoComponent implements OnInit {

  userData:UserElement[]=[];
  editObject : any;
  pageNo :Number = 1;
  itemsPerPage: Number = 10;
  searchData:any;
  editIndex : any;
  deletableObject: any;
  deletableObjectIndex: any;
  startDate: string;
  endDate: string;

  object : any = {id : Number, cashMemoNo: String, houseNo: String, cardHolderName: String, aadharNo: String, wheat: String, rice: String, kerosene:String, price:Number };
  serviceUrl="http://localhost:8085/userdata";
  constructor(private http: Http) {
   }
   today: any;
   lastDay: any;
   dd:any;
   mm:any;
   yyyy:any;
  ngOnInit() {
    console.log("user data is ",this.userData);
    this.today = new Date();
    this.dd = this.today.getDate();
    this.mm = this.today.getMonth() + 1; //January is 0!
    this.yyyy = this.today.getFullYear();
    this.today = this.yyyy + '-' + this.mm + '-' + this.dd;
    this.lastDay=(this.yyyy-1) + '-' + this.mm + '-' + this.dd;

    this.getUserData();
  }

  getUserData() {
    this.http.get(this.serviceUrl+"?startDate="+this.today+"&endDate="+this.lastDay)
  
    .subscribe(data => {
      console.log("data found from service ",data.json());
      
      this.userData=data.json();
    // let ud = {id : 1, cashMemoNo: "123", houseNo12: "house", cardHolderName: "roushan", aadharNo: "MyAdhar", wheat: "2kg", rice: "1kg", kOil:null, price:1010.40 };
    // this.userData.push(ud);
    console.log("user data is ",this.userData[1].id);
    }
  );

  }

  addData() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    let billMonthTemp = yyyy + '-' + mm ;

    let element = <UserElement> {edit:true,billMonth:billMonthTemp}; 
    this.userData.splice( 0, 0, element );
    this.editObject = this.userData[0];
    this.editIndex = 0;
  }

  downloadReport(){
    let totalAadhar:any = 0;
    let totalPrice : any= 0;
    let data= "Cash Memo No, E_B No, House no, Card Holder Name, Total Aadhar , Wheat , Rice , Kerosin oil, price , Billing Month \n";
    this.userData.forEach(user=>{
      totalAadhar+=user.aadharNo;
      totalPrice+= user.price;
      data+=user.cashMemoNo+","+user.ebNo+","+user.houseNo+","+user.cardHolderName+","+user.aadharNo+","+user.wheat+","+user.rice+","+user.kerosene+","+user.price+","+user.billMonth+"\n";
    });
    data+="\nTotal,,,,"+totalAadhar+",,,,"+totalPrice+",\n";
    const blob = new Blob([data], { type: 'text/csv' });
    saveAs(blob, "Report_from_"+this.lastDay+"_to_"+this.today+".csv");
  }

  openDeleteBox(data, index){
    var result = confirm("Want to delete?");
    if (result) {
      this.deletableObject = data;
      this.deletableObjectIndex = index;
      this.http.delete(this.serviceUrl+"/"+this.deletableObject.id).subscribe(data =>{
        this.userData.splice(this.deletableObjectIndex,1);
      });
    }
  }

  openEditBox(data, index) {
    console.log("open edit box called with inde ",index);
    
    data.edit=true;
    this.editObject = data;
    this.editIndex = index;
  }

  saveEditData() {
    console.log("sending data to edit ",this.editObject);
    
    if (this.editObject.id){
      this.http.put(this.serviceUrl, this.editObject).subscribe(data =>{
        this.userData[this.editIndex] = data.json();
      });
    }
    else if (!this.editObject.id) {
      this.http.post(this.serviceUrl, this.editObject).subscribe(data =>{
        try {
          this.userData[this.editIndex] = data.json();
        }
        catch(ex){
          window.alert("Data already filled");
        }     
      });
    }
  }

}
