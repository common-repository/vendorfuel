import template from "./customer-notes.html";

export const CustomerNotesComponent: ng.IComponentOptions = {
  bindings: {
    customerId: "<",
  },
  template,
  controller: class CustomerNotesController {
    static $inject: string[] = ["CustomerNotesService"];

    content: string;
    customerId: number;
    isLoading: boolean;
    isSaving: boolean;
    notes: {
      data: string[];
    };
    params: {
      page: number;
      rpp: number;
    };

    constructor(private CustomerNotesService: any) {}

    $onInit() {
      this.params = {
        page: 1,
        rpp: 15,
      };

      if (this.customerId) {
        this.queryNotes();
      }
    }

    change(key: string, value: string) {
      this.content = value;
    }

    changePage(page: number, rpp: number) {
      this.params.page = page;
      this.params.rpp = rpp;
      this.queryNotes();
    }

    queryNotes() {
      this.isLoading = true;
      this.CustomerNotesService.query(this.customerId).then(
        (response: { notes: any }) => {
          this.notes = response.notes;
          this.isLoading = false;
        }
      );
    }

    remove(noteId: number) {
      this.CustomerNotesService.remove(this.customerId, noteId).then(() => {
        this.queryNotes();
      });
    }

    save() {
      this.isSaving = true;
      const data = {
        content: this.content,
      };
      this.CustomerNotesService.save(this.customerId, data).then(() => {
        this.content = "";
        this.isSaving = false;
        this.queryNotes();
      });
    }
  },
};
