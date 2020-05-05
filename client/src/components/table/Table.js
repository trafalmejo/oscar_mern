import React, { Component } from "react";
import $ from "jquery";
import bootstrapTable from "bootstrap-table";

class ProjectsTable extends Component {
  operateFormatter(value, row, index) {
    return [
      '<a class="copy" href="javascript:void(0)" title="Copy">',
      '<i class="fa fa-copy"></i>',
      "</a>  ",
      '<a class="edit" href="javascript:void(0)" title="Edit">',
      '<i class="fa fa-edit"></i>',
      "</a>  ",
      '<a class="remove icon" href="javascript:void(0)" title="Remove">',
      '<i class="fa fa-times-circle"></i>',
      "</a>",
    ].join("");
  }
  componentDidMount() {
    window.operateEvents = {
      "click .edit": function (e, value, row, index) {
        alert("You click like action, row: " + JSON.stringify(row));
      },
      "click .remove": function (e, value, row, index) {
        //delete
        alert("You click like action, row: " + "delete");
      },
    };
    // Jquery here $(...)...
    $("#projects-table").bootstrapTable({
      url: "/api/projects",
      height: 300,
      columns: [
        {
          title: "Thumbnail",
          field: "thumbnail",
          sortable: false,
        },
        {
          title: "Name",
          field: "name",
          sortable: true,
        },
        {
          title: "Description",
          field: "description",
          sortable: false,
        },
        {
          title: "Visibility",
          field: "visibility",
          sortable: false,
        },
        {
          title: "Size",
          field: "size",
          sortable: true,
        },
        {
          title: "Date",
          field: "date",
          sortable: true,
        },
        {
          title: "Actions",
          field: "action",
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
