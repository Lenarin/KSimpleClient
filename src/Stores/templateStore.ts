import {action, observable} from "mobx";
import Template from "../Models/Template";
import agent from '../ajent';


class TemplateStore {
    @observable templates: Map<string, Template> | undefined;
    @observable loading: boolean = false;
    
    @action setTemplates(templates: Map<string, Template>) {
        this.templates = templates;
    }
    
    @action pullTemplates() {
        this.loading = true;
        return agent.Templates.pull()
            .then(action((response) => {
                this.templates = new Map<string, Template>();
                (response as unknown as Array<Template>).forEach((elem) => {
                    if (elem.id) this.templates?.set(elem.id, elem);
                })
            }))
            .then(action(() => this.loading = false))
        
    }
    
    @action pullTemplateTree(id: string) {
        this.loading = true;
        return agent.Templates.pullModelTree(id)
            .then(action((response) => {
                if (this.templates) {
                    const temp = this.templates.get(id);
                    if (temp) temp.modelTree = response;
                } else 
                    throw new Error("Template not found");
            }))
            .then(action(() => this.loading = false))
    }
}

export default new TemplateStore();