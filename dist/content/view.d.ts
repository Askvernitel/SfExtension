declare class SearchBarView {
    private container;
    private searchInput;
    private isVisible;
    constructor();
    private initialize;
    private setupEventListeners;
    private setupKeyboardShortcuts;
    private handleSearch;
    show(): void;
    hide(): void;
    toggle(): void;
}
declare const searchBar: SearchBarView;
export default searchBar;
//# sourceMappingURL=view.d.ts.map