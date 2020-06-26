import React, { Component } from "react";
import $ from "jquery";
import swal from "sweetalert";
import "sweetalert/dist/sweetalert.css";
import bootstrapTable from "bootstrap-table";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

class ProjectsTable extends Component {
  state = {
    show: false,
  };
  operateFormatter(value, row, index) {
    return [
      '<a class="share icon" href="javascript:void(0)" title="Share">',
      '<i class="fa fa-share-alt"></i>',
      "</a>  ",
      '<a class="copy icon" href="javascript:void(0)" title="Copy">',
      '<i class="fa fa-copy"></i>',
      "</a>  ",
      // '<a class="edit icon" href="javascript:void(0)" title="Edit">',
      // '<i class="fa fa-edit"></i>',
      // "</a>  ",
      '<a class="remove icon" href="javascript:void(0)" title="Remove">',
      '<i class="fa fa-times-circle"></i>',
      "</a>",
    ].join("");
  }
  dateFormatter(value, row, index) {
    let html = [];
    let date = new Date(value);
    var formatted =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    " " + date.getHours() + ":" + date.getMinutes() + "";
    html.push(formatted);

    return html.join("");
  }
  byteFormatter(bytes, row, index) {
    let html = [];
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    var size = Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    html.push(size);
    return html.join("");
  }
  deleteProject = () => {
    console.log("i am here");
  };
  componentDidMount() {
    var self = this;
    window.operateEvents = {
      "click .share": function (e, value, row, index) {
        Swal.fire({
          title: "Shared",
          text: "You can share your project with this code " + row._id,
          icon: "info",
          confirmButtonColor: "#ff365c",
        });
        // $.ajax({
        //   type: "GET",
        //   url: "/api/projects/share/" + row._id,
        //   headers: {
        //     x_auth_token: window.localStorage.getItem("token"), //If your header name has spaces or any other char not appropriate
        //   },
        //   success: function (data) {
        //     console.log(data);
        //     Swal.fire(
        //       "Shared",
        //       "You can share your project with this code",
        //       "info"
        //     );
        //   },
        //   error: function (err) {
        //     console.log("error");
        //     console.log(err);
        //     Swal.fire("Error", "Your file couldn't be shared.", "error");
        //   },
        // });
      },
      "click .copy": function (e, value, row, index) {
        $.ajax({
          type: "GET",
          url: "/api/projects/duplicate/" + row._id,
          headers: {
            x_auth_token: window.localStorage.getItem("token"), //If your header name has spaces or any other char not appropriate
          },
          success: function (data) {
            $("#projects-table").bootstrapTable("refresh");
            Swal.fire({
              title: "Duplicated!",
              text: "Your file has been duplicated.",
              icon: "success",
              confirmButtonColor: "#ff365c",
            });
          },
          error: function (err) {
            console.log("error");
            console.log(err);
            Swal.fire({
              title: "Error",
              text: "Your file couldn't be duplicated.",
              icon: "error",
              confirmButtonColor: "#ff365c",
            });
          },
        });
      },
      // "click .edit": function (e, value, row, index) {
      //   alert("You click like action, row: " + JSON.stringify(row));
      // },
      "click .remove": function (e, value, row, index) {
        Swal.fire({
          title: "Are you sure?",
          text: "If you delete this file, you can not recovere it later",
          icon: "warning",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonColor: "#ff365c",
          reverseButtons: true,
          focusCancel: true,
        }).then((result) => {
          if (result.value) {
            $.ajax({
              type: "DELETE",
              url: "/api/projects/" + row._id,
              headers: {
                x_auth_token: window.localStorage.getItem("token"), //If your header name has spaces or any other char not appropriate
              },
              success: function (data) {
                $("#projects-table").bootstrapTable("refresh");
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                  confirmButtonColor: "#ff365c",
                });
              },
              error: function (err) {
                console.log("error");
                console.log(err);
                Swal.fire({
                  title: "Error",
                  text: "Your file couldn't be deleted.",
                  icon: "error",
                  confirmButtonColor: "#ff365c",
                });
              },
            });
          }
        });
      },
    };
    //console.log(window.localStorage.getItem("token"));
    // Jquery here $(...)...
    $("#projects-table").bootstrapTable({
      url: "/api/projects/all",
      method: "get",
      ajaxOptions: {
        headers: { x_auth_token: window.localStorage.getItem("token") },
      },
      columns: [
        // {
        //   title: "Thumbnail",
        //   field: "thumbnail",
        //   sortable: false,
        // },
        {
          title: "Name",
          field: "name",
          sortable: true,
        },
        // {
        //   title: "Description",
        //   field: "description",
        //   sortable: false,
        // },
        {
          title: "Visibility",
          field: "visibility",
          sortable: false,
        },
        {
          title: "Size",
          field: "size",
          sortable: true,
          formatter: this.byteFormatter,
        },
        {
          title: "Date",
          field: "date",
          sortable: true,
          formatter: this.dateFormatter,
        },
        {
          title: "Actions",
          field: "action",
          sortable: false,
          clickToSelect: false,
          events: window.operateEvents,
          formatter: this.operateFormatter,
        },
      ],
      pagination: false,
      search: true,
      sortable: true,
      pageSize: 5,
      pageList: [],
      clickToSelect: true,
      singleSelect: true,
      // onClickRow: function (row, $element) {
      //   $("#project-name").val(row.name);
      //   // row: the record corresponding to the clicked row,
      //   // $element: the tr element.
      // },
    });
    $("#projects-table").bootstrapTable("refresh");
  }
  //Check for projects
  render() {
    return (
      <table
        id="projects-table"
        className="table table-borderless rounded"
      ></table>
    );
  }
}

export default ProjectsTable;
